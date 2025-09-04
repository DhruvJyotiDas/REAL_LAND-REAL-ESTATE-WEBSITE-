const validator = require('validator');

// Validate email
exports.isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password strength
exports.isValidPassword = (password) => {
  // At least 6 characters, one uppercase, one lowercase, one number
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength: !minLength ? 'Password must be at least 6 characters long' : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      hasLowerCase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      hasNumbers: !hasNumbers ? 'Password must contain at least one number' : null
    }
  };
};

// Validate Indian mobile number
exports.isValidIndianMobile = (mobile) => {
  const cleanMobile = mobile.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanMobile);
};

// Validate Indian pincode
exports.isValidIndianPincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

// Validate MongoDB ObjectId
exports.isValidObjectId = (id) => {
  return validator.isMongoId(id);
};

// Validate URL
exports.isValidURL = (url) => {
  return validator.isURL(url);
};

// Validate price
exports.isValidPrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
};

// Validate area
exports.isValidArea = (area) => {
  const numArea = parseFloat(area);
  return !isNaN(numArea) && numArea > 0;
};

// Validate property type
exports.isValidPropertyType = (type) => {
  const validTypes = ['apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop'];
  return validTypes.includes(type);
};

// Validate listing type
exports.isValidListingType = (type) => {
  const validTypes = ['sale', 'rent'];
  return validTypes.includes(type);
};

// Validate user role
exports.isValidUserRole = (role) => {
  const validRoles = ['buyer', 'seller', 'agent', 'admin'];
  return validRoles.includes(role);
};

// Validate coordinates
exports.isValidCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180;
};

// Validate date
exports.isValidDate = (date) => {
  return validator.isISO8601(date) && !isNaN(Date.parse(date));
};

// Validate age
exports.isValidAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 0 && numAge <= 200;
};

// Validate rooms count
exports.isValidRoomsCount = (count) => {
  const numCount = parseInt(count);
  return !isNaN(numCount) && numCount >= 0 && numCount <= 50;
};

// Validate file type (for images)
exports.isValidImageType = (mimetype) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimetype);
};

// Validate file size (in bytes)
exports.isValidFileSize = (size, maxSizeInMB = 10) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return size <= maxSizeInBytes;
};

// Validate Indian names (allow only letters and spaces)
exports.isValidName = (name) => {
  return /^[a-zA-Z\s]+$/.test(name) && name.trim().length >= 2;
};

// Validate property title
exports.isValidPropertyTitle = (title) => {
  return title && title.trim().length >= 5 && title.trim().length <= 100;
};

// Validate property description
exports.isValidPropertyDescription = (description) => {
  return description && description.trim().length >= 20 && description.trim().length <= 2000;
};

// Validate amenities array
exports.isValidAmenities = (amenities) => {
  if (!Array.isArray(amenities)) return false;
  
  const validAmenities = [
    'parking', 'gym', 'swimming_pool', 'garden', 'security', 
    'power_backup', 'elevator', 'water_supply', 'internet',
    'air_conditioning', 'balcony', 'terrace', 'store_room',
    'servant_room', 'study_room', 'pooja_room', 'library',
    'club_house', 'playground', 'medical_facility'
  ];
  
  return amenities.every(amenity => validAmenities.includes(amenity));
};

// Comprehensive property validation
exports.validatePropertyData = (propertyData) => {
  const errors = [];

  if (!this.isValidPropertyTitle(propertyData.title)) {
    errors.push('Title must be between 5 and 100 characters');
  }

  if (!this.isValidPropertyDescription(propertyData.description)) {
    errors.push('Description must be between 20 and 2000 characters');
  }

  if (!this.isValidPropertyType(propertyData.propertyType)) {
    errors.push('Invalid property type');
  }

  if (!this.isValidListingType(propertyData.listingType)) {
    errors.push('Invalid listing type');
  }

  if (!this.isValidPrice(propertyData.price)) {
    errors.push('Price must be a positive number');
  }

  if (!this.isValidArea(propertyData.area?.value)) {
    errors.push('Area must be a positive number');
  }

  if (!this.isValidIndianPincode(propertyData.location?.pincode)) {
    errors.push('Invalid pincode');
  }

  if (propertyData.bedrooms !== undefined && !this.isValidRoomsCount(propertyData.bedrooms)) {
    errors.push('Invalid bedrooms count');
  }

  if (propertyData.bathrooms !== undefined && !this.isValidRoomsCount(propertyData.bathrooms)) {
    errors.push('Invalid bathrooms count');
  }

  if (propertyData.amenities && !this.isValidAmenities(propertyData.amenities)) {
    errors.push('Invalid amenities');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
