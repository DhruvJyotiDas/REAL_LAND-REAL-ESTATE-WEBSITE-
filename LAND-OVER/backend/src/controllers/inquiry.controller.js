const Inquiry = require('../models/Inquiry.model');
const Property = require('../models/Property.model');
const User = require('../models/User.model');
const { sendEmail } = require('../services/emailService');

// @desc    Create new inquiry
// @route   POST /api/v1/inquiries
// @access  Private
exports.createInquiry = async (req, res, next) => {
  try {
    const { propertyId, type, message, contactPreference, preferredTime } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId).populate('owner', 'firstName lastName email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Don't allow inquiry to own property
    if (property.owner._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create inquiry for your own property'
      });
    }

    // Check if user already has pending inquiry for this property
    const existingInquiry = await Inquiry.findOne({
      property: propertyId,
      inquirer: req.user.id,
      status: { $in: ['pending', 'contacted', 'scheduled'] }
    });

    if (existingInquiry) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active inquiry for this property'
      });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property: propertyId,
      inquirer: req.user.id,
      propertyOwner: property.owner._id,
      type,
      message,
      contactPreference: contactPreference || 'phone',
      preferredTime
    });

    // Populate inquiry
    await inquiry.populate([
      { path: 'property', select: 'title location.address location.city price' },
      { path: 'inquirer', select: 'firstName lastName email phone' }
    ]);

    // Send email notification to property owner
    try {
      await sendEmail({
        to: property.owner.email,
        subject: 'New Property Inquiry - LAND OVER',
        template: 'propertyInquiry',
        context: {
          ownerName: property.owner.firstName,
          propertyTitle: property.title,
          inquirerName: `${inquiry.inquirer.firstName} ${inquiry.inquirer.lastName}`,
          inquirerEmail: inquiry.inquirer.email,
          inquirerPhone: inquiry.inquirer.phone,
          message: inquiry.message,
          inquiryType: inquiry.type,
          dashboardUrl: `${process.env.CLIENT_URL}/dashboard/inquiries`
        }
      });
    } catch (emailError) {
      console.error('Failed to send inquiry notification email:', emailError);
    }

    res.status(201).json({
      success: true,
      data: { inquiry }
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating inquiry'
    });
  }
};

// @desc    Get user inquiries (sent)
// @route   GET /api/v1/inquiries/sent
// @access  Private
exports.getSentInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const inquiries = await Inquiry.find({ inquirer: req.user.id })
      .populate('property', 'title location.address location.city price images propertyType')
      .populate('propertyOwner', 'firstName lastName email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Inquiry.countDocuments({ inquirer: req.user.id });

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
      count: inquiries.length,
      pagination,
      data: { inquiries }
    });
  } catch (error) {
    console.error('Get sent inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiries'
    });
  }
};

// @desc    Get received inquiries
// @route   GET /api/v1/inquiries/received
// @access  Private
exports.getReceivedInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = { propertyOwner: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const inquiries = await Inquiry.find(filter)
      .populate('property', 'title location.address location.city price images propertyType')
      .populate('inquirer', 'firstName lastName email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Inquiry.countDocuments(filter);

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
      count: inquiries.length,
      pagination,
      data: { inquiries }
    });
  } catch (error) {
    console.error('Get received inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiries'
    });
  }
};

// @desc    Respond to inquiry
// @route   PUT /api/v1/inquiries/:id/respond
// @access  Private
exports.respondToInquiry = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id)
      .populate('inquirer', 'firstName lastName email')
      .populate('property', 'title');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Make sure user is the property owner
    if (inquiry.propertyOwner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this inquiry'
      });
    }

    // Update inquiry with response
    await inquiry.markAsContacted(req.user.id, message);

    // Send email to inquirer
    try {
      await sendEmail({
        to: inquiry.inquirer.email,
        subject: 'Response to Your Property Inquiry - LAND OVER',
        template: 'inquiryResponse',
        context: {
          inquirerName: inquiry.inquirer.firstName,
          propertyTitle: inquiry.property.title,
          responseMessage: message,
          dashboardUrl: `${process.env.CLIENT_URL}/dashboard/inquiries`
        }
      });
    } catch (emailError) {
      console.error('Failed to send response email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Response sent successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Respond to inquiry error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while responding to inquiry'
    });
  }
};

// @desc    Schedule meeting for inquiry
// @route   PUT /api/v1/inquiries/:id/schedule
// @access  Private
exports.scheduleMeeting = async (req, res, next) => {
  try {
    const { date, time, location, type } = req.body;

    if (!date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: 'Date, time, and meeting type are required'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id)
      .populate('inquirer', 'firstName lastName email')
      .populate('property', 'title');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Make sure user is the property owner
    if (inquiry.propertyOwner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule meeting for this inquiry'
      });
    }

    // Schedule meeting
    await inquiry.scheduleMeeting({
      date: new Date(date),
      time,
      location: location || '',
      type
    });

    // Send email to inquirer
    try {
      await sendEmail({
        to: inquiry.inquirer.email,
        subject: 'Meeting Scheduled - LAND OVER',
        template: 'meetingScheduled',
        context: {
          inquirerName: inquiry.inquirer.firstName,
          propertyTitle: inquiry.property.title,
          meetingDate: new Date(date).toLocaleDateString(),
          meetingTime: time,
          meetingType: type,
          location: location || 'Virtual Meeting',
          dashboardUrl: `${process.env.CLIENT_URL}/dashboard/inquiries`
        }
      });
    } catch (emailError) {
      console.error('Failed to send meeting notification email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Meeting scheduled successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Schedule meeting error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while scheduling meeting'
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/v1/inquiries/:id/status
// @access  Private
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Make sure user is involved in this inquiry
    if (inquiry.propertyOwner.toString() !== req.user.id && 
        inquiry.inquirer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: { inquiry }
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating inquiry status'
    });
  }
};
