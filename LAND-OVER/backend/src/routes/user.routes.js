const express = require('express');
const router = express.Router();

// Import controllers
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserProperties,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  deleteAccount
} = require('../controllers/user.controller');

// Import middleware
const { protect } = require('../middleware/auth.middleware');
const { uploadSingleImage } = require('../middleware/upload.middleware');
const { validateProfileUpdate } = require('../middleware/validation.middleware');

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.post('/profile/image', uploadSingleImage, uploadProfileImage);

// User properties
router.get('/properties', getUserProperties);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/:propertyId', addToWishlist);
router.delete('/wishlist/:propertyId', removeFromWishlist);

// Account management
router.delete('/account', deleteAccount);

module.exports = router;
