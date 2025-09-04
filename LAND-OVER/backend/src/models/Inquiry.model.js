const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required'],
  },
  inquirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Inquirer reference is required'],
  },
  propertyOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner reference is required'],
  },
  type: {
    type: String,
    enum: ['visit', 'call', 'email', 'general'],
    required: [true, 'Inquiry type is required'],
  },
  message: {
    type: String,
    required: [true, 'Inquiry message is required'],
    maxlength: [1000, 'Message cannot be more than 1000 characters'],
  },
  contactPreference: {
    type: String,
    enum: ['phone', 'email', 'whatsapp'],
    default: 'phone',
  },
  preferredTime: {
    date: Date,
    time: String,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending',
  },
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  meetingScheduled: {
    date: Date,
    time: String,
    location: String,
    type: {
      type: String,
      enum: ['physical', 'virtual'],
    },
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters'],
  },
}, {
  timestamps: true,
});

// Indexes
inquirySchema.index({ property: 1 });
inquirySchema.index({ inquirer: 1 });
inquirySchema.index({ propertyOwner: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

// Compound indexes
inquirySchema.index({ propertyOwner: 1, status: 1 });
inquirySchema.index({ property: 1, createdAt: -1 });

// Method to mark as contacted
inquirySchema.methods.markAsContacted = function(responderId, responseMessage) {
  this.status = 'contacted';
  this.response = {
    message: responseMessage,
    respondedAt: new Date(),
    respondedBy: responderId,
  };
  return this.save();
};

// Method to schedule meeting
inquirySchema.methods.scheduleMeeting = function(meetingDetails) {
  this.status = 'scheduled';
  this.meetingScheduled = meetingDetails;
  return this.save();
};

module.exports = mongoose.model('Inquiry', inquirySchema);
