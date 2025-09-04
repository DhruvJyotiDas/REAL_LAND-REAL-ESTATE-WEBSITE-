const Property = require('../models/Property.model');
const User = require('../models/User.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/uploadService');

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Property.find(JSON.parse(queryStr))
      .populate('owner', 'firstName lastName email phone profileImage')
      .populate('agent', 'firstName lastName email phone profileImage');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-featured -createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const properties = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: { properties }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties'
    });
  }
};

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone profileImage')
      .populate('agent', 'firstName lastName email phone profileImage');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    await property.incrementViews();

    res.status(200).json({
      success: true,
      data: { property }
    });
  } catch (error) {
    console.error('Get property error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching property'
    });
  }
};

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: { property }
    });
  } catch (error) {
    console.error('Create property error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating property'
    });
  }
};

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: { property }
    });
  } catch (error) {
    console.error('Update property error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating property'
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    // Delete images from cloudinary
    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting property'
    });
  }
};

// @desc    Upload property images
// @route   POST /api/v1/properties/:id/images
// @access  Private
exports.propertyImageUpload = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Upload images to cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        folder: 'land-over/properties',
        width: 1200,
        height: 800,
        crop: 'fill',
        quality: 'auto'
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    
    const images = uploadResults.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));

    // Add new images to existing ones
    property.images = [...property.images, ...images];
    await property.save();

    res.status(200).json({
      success: true,
      data: { images }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Search properties
// @route   GET /api/v1/properties/search
// @access  Public
exports.searchProperties = async (req, res, next) => {
  try {
    const {
      q, // search query
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
      amenities,
      sort,
      page = 1,
      limit = 25
    } = req.query;

    let query = {};

    // Only show active properties
    query.status = 'active';

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Property type filter
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Listing type filter
    if (listingType) {
      query.listingType = listingType;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Bedrooms filter
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }

    // Bathrooms filter
    if (bathrooms) {
      query.bathrooms = { $gte: parseInt(bathrooms) };
    }

    // Location filters
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $in: amenitiesArray };
    }

    // Build sort object
    let sortObj = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortObj[field.substring(1)] = -1;
        } else {
          sortObj[field] = 1;
        }
      });
    } else {
      sortObj = { featured: -1, createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email phone profileImage')
      .populate('agent', 'firstName lastName email phone profileImage')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Property.countDocuments(query);

    // Calculate pagination
    const pagination = {
      current: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    };

    if (pageNum < Math.ceil(total / limitNum)) {
      pagination.next = pageNum + 1;
    }

    if (pageNum > 1) {
      pagination.prev = pageNum - 1;
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: { properties }
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during property search'
    });
  }
};
