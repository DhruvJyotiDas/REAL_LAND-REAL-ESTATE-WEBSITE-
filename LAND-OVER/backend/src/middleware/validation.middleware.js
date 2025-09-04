const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'agent'])
    .withMessage('Invalid role specified'),

  handleValidationErrors
];

// User login validation
exports.validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Property validation
exports.validateProperty = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Property title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Property description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('propertyType')
    .isIn(['apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop'])
    .withMessage('Invalid property type'),

  body('listingType')
    .isIn(['sale', 'rent'])
    .withMessage('Listing type must be either sale or rent'),

  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => value > 0)
    .withMessage('Price must be greater than 0'),

  body('area.value')
    .isNumeric()
    .withMessage('Area value must be a number')
    .custom(value => value > 0)
    .withMessage('Area must be greater than 0'),

  body('area.unit')
    .isIn(['sqft', 'sqm', 'acres'])
    .withMessage('Invalid area unit'),

  body('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),

  body('bathrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bathrooms must be between 0 and 20'),

  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),

  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('location.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit pincode'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),

  handleValidationErrors
];

// Property update validation (similar to create but all fields optional)
exports.validatePropertyUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('propertyType')
    .optional()
    .isIn(['apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop'])
    .withMessage('Invalid property type'),

  body('listingType')
    .optional()
    .isIn(['sale', 'rent'])
    .withMessage('Listing type must be either sale or rent'),

  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => value > 0)
    .withMessage('Price must be greater than 0'),

  body('area.value')
    .optional()
    .isNumeric()
    .withMessage('Area value must be a number')
    .custom(value => value > 0)
    .withMessage('Area must be greater than 0'),

  body('area.unit')
    .optional()
    .isIn(['sqft', 'sqm', 'acres'])
    .withMessage('Invalid area unit'),

  handleValidationErrors
];

// Profile update validation
exports.validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('preferences.budgetRange.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum budget must be a number'),

  body('preferences.budgetRange.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum budget must be a number'),

  body('preferences.propertyTypes')
    .optional()
    .isArray()
    .withMessage('Property types must be an array'),

  handleValidationErrors
];

// Inquiry validation
exports.validateInquiry = [
  body('propertyId')
    .isMongoId()
    .withMessage('Invalid property ID'),

  body('type')
    .isIn(['visit', 'call', 'email', 'general'])
    .withMessage('Invalid inquiry type'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),

  body('contactPreference')
    .optional()
    .isIn(['phone', 'email', 'whatsapp'])
    .withMessage('Invalid contact preference'),

  handleValidationErrors
];

// Admin user update validation
exports.validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'agent', 'admin'])
    .withMessage('Invalid role specified'),

  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean value'),

  handleValidationErrors
];
