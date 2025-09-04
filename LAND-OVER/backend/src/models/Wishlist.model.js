const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
}, {
  timestamps: true,
});

// Compound unique index to prevent duplicate entries
wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

// Index for user queries
wishlistSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
