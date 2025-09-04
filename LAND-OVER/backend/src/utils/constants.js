// API Response Messages
exports.MESSAGES = {
  SUCCESS: {
    REGISTRATION: 'Registration successful. Please check your email to verify your account.',
    LOGIN: 'Login successful',
    LOGOUT: 'Successfully logged out',
    EMAIL_VERIFIED: 'Email verified successfully',
    PASSWORD_RESET_EMAIL: 'Password reset email sent',
    PASSWORD_RESET: 'Password reset successful',
    PASSWORD_UPDATE: 'Password updated successfully',
    PROFILE_UPDATE: 'Profile updated successfully',
    PROPERTY_CREATED: 'Property listed successfully',
    PROPERTY_UPDATED: 'Property updated successfully',
    PROPERTY_DELETED: 'Property deleted successfully',
    IMAGE_UPLOADED: 'Images uploaded successfully',
    INQUIRY_SENT: 'Inquiry sent successfully',
    INQUIRY_RESPONDED: 'Response sent successfully',
    MEETING_SCHEDULED: 'Meeting scheduled successfully',
    WISHLIST_ADDED: 'Property added to wishlist',
    WISHLIST_REMOVED: 'Property removed from wishlist',
    ACCOUNT_DELETED: 'Account deleted successfully'
  },
  ERROR: {
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Not authorized to access this resource',
    FORBIDDEN: 'Access forbidden',
    USER_EXISTS: 'User already exists with this email',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_LOCKED: 'Account temporarily locked due to too many failed attempts',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    PROPERTY_NOT_FOUND: 'Property not found',
    INQUIRY_NOT_FOUND: 'Inquiry not found',
    INVALID_TOKEN: 'Invalid or expired token',
    TOKEN_REQUIRED: 'Access token required',
    EMAIL_SEND_FAILED: 'Failed to send email',
    IMAGE_UPLOAD_FAILED: 'Image upload failed',
    FILE_TOO_LARGE: 'File size too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    TOO_MANY_REQUESTS: 'Too many requests, please try again later'
  }
};

// Property Types
exports.PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  VILLA: 'villa',
  PLOT: 'plot',
  COMMERCIAL: 'commercial',
  OFFICE: 'office',
  SHOP: 'shop'
};

// Listing Types
exports.LISTING_TYPES = {
  SALE: 'sale',
  RENT: 'rent'
};

// User Roles
exports.USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  AGENT: 'agent',
  ADMIN: 'admin'
};

// Property Status
exports.PROPERTY_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  RENTED: 'rented',
  INACTIVE: 'inactive',
  PENDING_APPROVAL: 'pending_approval'
};

// Inquiry Status
exports.INQUIRY_STATUS = {
  PENDING: 'pending',
  CONTACTED: 'contacted',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Inquiry Types
exports.INQUIRY_TYPES = {
  VISIT: 'visit',
  CALL: 'call',
  EMAIL: 'email',
  GENERAL: 'general'
};

// Contact Preferences
exports.CONTACT_PREFERENCES = {
  PHONE: 'phone',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp'
};

// Area Units
exports.AREA_UNITS = {
  SQFT: 'sqft',
  SQM: 'sqm',
  ACRES: 'acres'
};

// Furnishing Types
exports.FURNISHING_TYPES = {
  FURNISHED: 'furnished',
  SEMI_FURNISHED: 'semi-furnished',
  UNFURNISHED: 'unfurnished'
};

// Available Amenities
exports.AMENITIES = {
  PARKING: 'parking',
  GYM: 'gym',
  SWIMMING_POOL: 'swimming_pool',
  GARDEN: 'garden',
  SECURITY: 'security',
  POWER_BACKUP: 'power_backup',
  ELEVATOR: 'elevator',
  WATER_SUPPLY: 'water_supply',
  INTERNET: 'internet',
  AIR_CONDITIONING: 'air_conditioning',
  BALCONY: 'balcony',
  TERRACE: 'terrace',
  STORE_ROOM: 'store_room',
  SERVANT_ROOM: 'servant_room',
  STUDY_ROOM: 'study_room',
  POOJA_ROOM: 'pooja_room',
  LIBRARY: 'library',
  CLUB_HOUSE: 'club_house',
  PLAYGROUND: 'playground',
  MEDICAL_FACILITY: 'medical_facility'
};

// Amenities Labels (for frontend display)
exports.AMENITIES_LABELS = {
  [exports.AMENITIES.PARKING]: 'Parking',
  [exports.AMENITIES.GYM]: 'Gym',
  [exports.AMENITIES.SWIMMING_POOL]: 'Swimming Pool',
  [exports.AMENITIES.GARDEN]: 'Garden',
  [exports.AMENITIES.SECURITY]: '24/7 Security',
  [exports.AMENITIES.POWER_BACKUP]: 'Power Backup',
  [exports.AMENITIES.ELEVATOR]: 'Elevator',
  [exports.AMENITIES.WATER_SUPPLY]: '24/7 Water Supply',
  [exports.AMENITIES.INTERNET]: 'Internet',
  [exports.AMENITIES.AIR_CONDITIONING]: 'Air Conditioning',
  [exports.AMENITIES.BALCONY]: 'Balcony',
  [exports.AMENITIES.TERRACE]: 'Terrace',
  [exports.AMENITIES.STORE_ROOM]: 'Store Room',
  [exports.AMENITIES.SERVANT_ROOM]: 'Servant Room',
  [exports.AMENITIES.STUDY_ROOM]: 'Study Room',
  [exports.AMENITIES.POOJA_ROOM]: 'Pooja Room',
  [exports.AMENITIES.LIBRARY]: 'Library',
  [exports.AMENITIES.CLUB_HOUSE]: 'Club House',
  [exports.AMENITIES.PLAYGROUND]: 'Playground',
  [exports.AMENITIES.MEDICAL_FACILITY]: 'Medical Facility'
};

// File Upload Limits
exports.FILE_LIMITS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_DOCUMENT_SIZE: 20 * 1024 * 1024, // 20MB
  MAX_IMAGES_PER_PROPERTY: 10,
  MAX_DOCUMENTS_PER_TRANSACTION: 5
};

// Rate Limiting
exports.RATE_LIMITS = {
  GENERAL: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
  AUTH: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 auth attempts per 15 minutes
  UPLOAD: { windowMs: 60 * 60 * 1000, max: 50 }, // 50 uploads per hour
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, max: 3 } // 3 password resets per hour
};

// Pagination Defaults
exports.PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100
};

// JWT Configuration
exports.JWT = {
  EXPIRES_IN: '30d',
  COOKIE_EXPIRES_IN: 30 // days
};

// Email Templates
exports.EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  VERIFY_EMAIL: 'verifyEmail',
  RESET_PASSWORD: 'resetPassword',
  PROPERTY_INQUIRY: 'propertyInquiry',
  INQUIRY_RESPONSE: 'inquiryResponse',
  MEETING_SCHEDULED: 'meetingScheduled'
};

// Cloudinary Folders
exports.CLOUDINARY_FOLDERS = {
  PROPERTIES: 'land-over/properties',
  PROFILES: 'land-over/profiles',
  DOCUMENTS: 'land-over/documents'
};

// Image Transformations
exports.IMAGE_TRANSFORMATIONS = {
  PROPERTY_MAIN: { width: 1200, height: 800, crop: 'fill' },
  PROPERTY_THUMB: { width: 300, height: 200, crop: 'fill' },
  PROFILE: { width: 300, height: 300, crop: 'fill', gravity: 'face' },
  PROFILE_THUMB: { width: 100, height: 100, crop: 'fill', gravity: 'face' }
};

// Search Filters
exports.SEARCH_FILTERS = {
  SORT_OPTIONS: [
    { value: '-featured -createdAt', label: 'Featured First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-views', label: 'Most Viewed' }
  ],
  PRICE_RANGES: [
    { min: 0, max: 2500000, label: 'Under ₹25 Lakh' },
    { min: 2500000, max: 5000000, label: '₹25L - ₹50L' },
    { min: 5000000, max: 10000000, label: '₹50L - ₹1 Cr' },
    { min: 10000000, max: 25000000, label: '₹1 Cr - ₹2.5 Cr' },
    { min: 25000000, max: null, label: 'Above ₹2.5 Cr' }
  ]
};

// Common Regex Patterns
exports.REGEX = {
  INDIAN_MOBILE: /^[6-9]\d{9}$/,
  INDIAN_PINCODE: /^[1-9][0-9]{5}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/
};

// Indian States for validation
exports.INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Environment Configurations
exports.ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};
