const User = require('../models/User.model');
const Property = require('../models/Property.model');
const Wishlist = require('../models/Wishlist.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/uploadService');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      preferences: req.body.preferences
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/v1/users/profile/image
// @access  Private
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete existing profile image if exists
    if (user.profileImage && user.profileImage.public_id) {
      await deleteFromCloudinary(user.profileImage.public_id);
    }

    // Upload new image to cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'land-over/profiles',
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto'
    });

    // Update user profile image
    user.profileImage = {
      public_id: result.public_id,
      url: result.secure_url
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: { 
        profileImage: user.profileImage 
      }
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Get user properties
// @route   GET /api/v1/users/properties
// @access  Private
exports.getUserProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find({ owner: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments({ owner: req.user.id });

    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total
    };

    if (page < Math.ceil(total / limit)) {
      pagination.next = page + 1;
    }

    if (page > 1) {
      pagination.prev = page - 1;
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: { properties }
    });
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties'
    });
  }
};

// @desc    Add property to wishlist
// @route   POST /api/v1/users/wishlist/:propertyId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { notes } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      user: req.user.id,
      property: propertyId
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: 'Property already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      property: propertyId,
      notes: notes || ''
    });

    await wishlistItem.populate('property', 'title price location.city location.state images propertyType listingType');

    res.status(201).json({
      success: true,
      data: { wishlistItem }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist'
    });
  }
};

// @desc    Get user wishlist
// @route   GET /api/v1/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate('property', 'title price location.city location.state images propertyType listingType status')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Wishlist.countDocuments({ user: req.user.id });

    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total
    };

    if (page < Math.ceil(total / limit)) {
      pagination.next = page + 1;
    }

    if (page > 1) {
      pagination.prev = page - 1;
    }

    res.status(200).json({
      success: true,
      count: wishlist.length,
      pagination,
      data: { wishlist }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
};

// @desc    Remove property from wishlist
// @route   DELETE /api/v1/users/wishlist/:propertyId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user.id,
      property: propertyId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Property not found in wishlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid property ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/users/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete profile image if exists
    if (user.profileImage && user.profileImage.public_id) {
      await deleteFromCloudinary(user.profileImage.public_id);
    }

    // Find and delete user's properties and their images
    const userProperties = await Property.find({ owner: req.user.id });
    
    for (const property of userProperties) {
      // Delete property images
      if (property.images && property.images.length > 0) {
        for (const image of property.images) {
          await deleteFromCloudinary(image.public_id);
        }
      }
      await property.deleteOne();
    }

    // Delete user's wishlist
    await Wishlist.deleteMany({ user: req.user.id });

    // Delete user account
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
};
