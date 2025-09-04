const User = require('../models/User.model');
const Property = require('../models/Property.model');
const Inquiry = require('../models/Inquiry.model');
const Transaction = require('../models/Transaction.model');

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'active' });
    const pendingProperties = await Property.countDocuments({ status: 'pending_approval' });
    const totalInquiries = await Inquiry.countDocuments();
    
    // Get user role distribution
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get properties by type
    const propertiesByType = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentProperties = await Property.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Monthly registration trend (last 6 months)
    const monthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProperties,
          activeProperties,
          pendingProperties,
          totalInquiries
        },
        distributions: {
          usersByRole,
          propertiesByType
        },
        recentActivity: {
          recentUsers,
          recentProperties
        },
        trends: {
          monthlyUsers
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.verified !== undefined) {
      filter.isVerified = req.query.verified === 'true';
    }
    
    if (req.query.search) {
      filter.$or = [
        { firstName: new RegExp(req.query.search, 'i') },
        { lastName: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') }
      ];
    }

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

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
      count: users.length,
      pagination,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'role', 'isVerified'];
    const updateData = {};

    // Only include allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

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
    console.error('Update user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
      message: 'Server error while updating user'
    });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin' && req.user.id !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete other admin users'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

// @desc    Get all properties for moderation (Admin)
// @route   GET /api/v1/admin/properties
// @access  Private (Admin)
exports.getPropertiesForModeration = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }

    if (req.query.verified !== undefined) {
      filter.verified = req.query.verified === 'true';
    }

    // Get properties
    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(filter);

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
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties'
    });
  }
};

// @desc    Approve/Reject property (Admin)
// @route   PUT /api/v1/admin/properties/:id/moderate
// @access  Private (Admin)
exports.moderateProperty = async (req, res, next) => {
  try {
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (action === 'approve') {
      property.status = 'active';
      property.verified = true;
    } else {
      property.status = 'inactive';
      property.verified = false;
    }

    await property.save();

    // TODO: Send notification email to property owner

    res.status(200).json({
      success: true,
      message: `Property ${action}d successfully`,
      data: { property }
    });
  } catch (error) {
    console.error('Moderate property error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while moderating property'
    });
  }
};
