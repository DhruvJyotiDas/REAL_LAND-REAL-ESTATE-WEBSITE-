const Property = require('../models/Property.model');
const User = require('../models/User.model');

// Create property service
exports.createProperty = async (propertyData, ownerId) => {
  try {
    const property = await Property.create({
      ...propertyData,
      owner: ownerId
    });

    await property.populate('owner', 'firstName lastName email phone');
    return property;
  } catch (error) {
    throw new Error(`Create property failed: ${error.message}`);
  }
};

// Get properties with advanced filtering
exports.getProperties = async (filters = {}, options = {}) => {
  try {
    const {
      page = 1,
      limit = 25,
      sort = '-featured -createdAt',
      select,
      populate = true
    } = options;

    const skip = (page - 1) * limit;

    // Build query
    let query = Property.find(filters);

    // Add population if requested
    if (populate) {
      query = query
        .populate('owner', 'firstName lastName email phone profileImage')
        .populate('agent', 'firstName lastName email phone profileImage');
    }

    // Add selection if specified
    if (select) {
      query = query.select(select);
    }

    // Add sorting
    query = query.sort(sort);

    // Add pagination
    query = query.skip(skip).limit(limit);

    // Execute query
    const properties = await query;

    // Get total count for pagination
    const total = await Property.countDocuments(filters);

    return {
      properties,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Get properties failed: ${error.message}`);
  }
};

// Search properties with text and location
exports.searchProperties = async (searchParams) => {
  try {
    const {
      q, // text search
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
      amenities,
      latitude,
      longitude,
      radius, // in km
      page = 1,
      limit = 25,
      sort = '-featured -createdAt'
    } = searchParams;

    let query = {};

    // Only show active properties
    query.status = 'active';

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Property filters
    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    // Room filters
    if (bedrooms) query.bedrooms = { $gte: bedrooms };
    if (bathrooms) query.bathrooms = { $gte: bathrooms };

    // Location filters
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');

    // Amenities filter
    if (amenities && amenities.length > 0) {
      query.amenities = { $in: amenities };
    }

    // Geolocation search
    if (latitude && longitude && radius) {
      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6371] // radius in radians
        }
      };
    }

    const result = await this.getProperties(query, {
      page,
      limit,
      sort: q ? undefined : sort // Use relevance sort for text search
    });

    return result;
  } catch (error) {
    throw new Error(`Property search failed: ${error.message}`);
  }
};

// Get similar properties
exports.getSimilarProperties = async (propertyId, limit = 5) => {
  try {
    const property = await Property.findById(propertyId);
    
    if (!property) {
      throw new Error('Property not found');
    }

    const similarQuery = {
      _id: { $ne: propertyId }, // Exclude current property
      status: 'active',
      propertyType: property.propertyType,
      listingType: property.listingType,
      'location.city': property.location.city,
      price: {
        $gte: property.price * 0.7, // 30% below
        $lte: property.price * 1.3  // 30% above
      }
    };

    const similarProperties = await Property.find(similarQuery)
      .populate('owner', 'firstName lastName email phone')
      .limit(limit)
      .sort('-featured -createdAt');

    return similarProperties;
  } catch (error) {
    throw new Error(`Get similar properties failed: ${error.message}`);
  }
};

// Get property statistics
exports.getPropertyStats = async () => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'active' });
    const pendingProperties = await Property.countDocuments({ status: 'pending_approval' });

    const propertiesByType = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    const propertiesByListingType = await Property.aggregate([
      { $group: { _id: '$listingType', count: { $sum: 1 } } }
    ]);

    const averagePrice = await Property.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$listingType', avgPrice: { $avg: '$price' } } }
    ]);

    const recentProperties = await Property.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    return {
      totalProperties,
      activeProperties,
      pendingProperties,
      propertiesByType,
      propertiesByListingType,
      averagePrice,
      recentProperties
    };
  } catch (error) {
    throw new Error(`Get property stats failed: ${error.message}`);
  }
};

// Get trending properties (most viewed)
exports.getTrendingProperties = async (limit = 10) => {
  try {
    const trendingProperties = await Property.find({ status: 'active' })
      .populate('owner', 'firstName lastName email phone')
      .sort('-views -createdAt')
      .limit(limit);

    return trendingProperties;
  } catch (error) {
    throw new Error(`Get trending properties failed: ${error.message}`);
  }
};

// Get properties by location with stats
exports.getPropertiesByLocation = async (city, state) => {
  try {
    const query = {
      status: 'active',
      'location.city': new RegExp(city, 'i'),
      'location.state': new RegExp(state, 'i')
    };

    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email phone')
      .sort('-featured -createdAt');

    // Get location statistics
    const stats = await Property.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$listingType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    return {
      properties,
      stats,
      location: { city, state }
    };
  } catch (error) {
    throw new Error(`Get properties by location failed: ${error.message}`);
  }
};
