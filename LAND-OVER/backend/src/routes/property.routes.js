const express = require('express');
const router = express.Router();

// Import controllers
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  propertyImageUpload,
  searchProperties
} = require('../controllers/property.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadMultipleImages } = require('../middleware/upload.middleware');
const { 
  validateProperty, 
  validatePropertyUpdate 
} = require('../middleware/validation.middleware');

// Public routes
router.get('/', getProperties);
router.get('/search', searchProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/', 
  authorize('seller', 'agent', 'admin'), 
  validateProperty, 
  createProperty
);

router.put('/:id', 
  authorize('seller', 'agent', 'admin'), 
  validatePropertyUpdate, 
  updateProperty
);

router.delete('/:id', 
  authorize('seller', 'agent', 'admin'), 
  deleteProperty
);

router.post('/:id/images', 
  authorize('seller', 'agent', 'admin'), 
  uploadMultipleImages, 
  propertyImageUpload
);

module.exports = router;
