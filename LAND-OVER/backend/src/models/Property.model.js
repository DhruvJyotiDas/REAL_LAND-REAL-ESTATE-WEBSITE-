const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop'],
      message: 'Invalid property type',
    },
  },
  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: {
      values: ['sale', 'rent'],
      message: 'Listing type must be either sale or rent',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Area value is required'],
      min: [1, 'Area must be at least 1'],
    },
    unit: {
      type: String,
      required: [true, 'Area unit is required'],
      enum: ['sqft', 'sqm', 'acres'],
      default: 'sqft',
    },
  },
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative'],
    max: [20, 'Bedrooms cannot exceed 20'],
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative'],
    max: [20, 'Bathrooms cannot exceed 20'],
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid pincode'],
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
  },
  amenities: [{
    type: String,
    trim: true,
  }],
  images: [{
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
  virtualTour: {
    url: String,
    type: {
      type: String,
      enum: ['360', 'video', '3d'],
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required'],
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive', 'pending_approval'],
    default: 'pending_approval',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  availableFrom: {
    type: Date,
    default: Date.now,
  },
  furnished: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
  },
  parking: {
    type: Number,
    min: [0, 'Parking spaces cannot be negative'],
    default: 0,
  },
  age: {
    type: Number,
    min: [0, 'Property age cannot be negative'],
    max: [100, 'Property age cannot exceed 100 years'],
  },
  floor: {
    current: {
      type: Number,
      min: [0, 'Floor cannot be negative'],
    },
    total: {
      type: Number,
      min: [1, 'Total floors must be at least 1'],
    },
  },
  pricePerSqft: {
    type: Number,
    min: [0, 'Price per sqft cannot be negative'],
  },
  nearbyPlaces: [{
    name: { type: String, trim: true },
    distance: { type: Number, min: 0 },
    type: {
      type: String,
      enum: ['school', 'hospital', 'market', 'transport', 'restaurant', 'bank', 'other'],
    },
  }],
  contactDetails: {
    showOwnerDetails: {
      type: Boolean,
      default: true,
    },
    alternatePhone: String,
    bestTimeToCall: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime',
    },
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
propertySchema.index({ status: 1, propertyType: 1 });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ featured: -1, createdAt: -1 });
propertySchema.index({ views: -1 });

// Compound indexes for complex queries
propertySchema.index({
  propertyType: 1,
  listingType: 1,
  'location.city': 1,
  status: 1,
});

// Text index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(this.price);
});

// Calculate price per sqft before saving
propertySchema.pre('save', function(next) {
  if (this.price && this.area && this.area.value) {
    let areaInSqft = this.area.value;
    
    // Convert to sqft if needed
    if (this.area.unit === 'sqm') {
      areaInSqft = this.area.value * 10.764;
    } else if (this.area.unit === 'acres') {
      areaInSqft = this.area.value * 43560;
    }
    
    this.pricePerSqft = Math.round(this.price / areaInSqft);
  }
  next();
});

// Method to increment views
propertySchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { views: 1 } });
};

// Static method to get properties within radius
propertySchema.statics.getPropertiesWithinRadius = function(latitude, longitude, radius) {
  const radiusInRadians = radius / 6371; // Earth's radius in km
  
  return this.find({
    'location.coordinates': {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radiusInRadians],
      },
    },
  });
};

// Transform output
propertySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Property', propertySchema);
