const { cloudinary } = require('../config/cloudinary.config');
const streamifier = require('streamifier');

// Upload single image to cloudinary
exports.uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Upload multiple images to cloudinary
exports.uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => 
      this.uploadToCloudinary(file.buffer, {
        ...options,
        public_id: options.public_id ? 
          `${options.public_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : 
          undefined
      })
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

// Delete image from cloudinary
exports.deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    if (result.result === 'ok') {
      console.log(`✅ Deleted from Cloudinary: ${publicId}`);
      return result;
    } else {
      console.warn(`⚠️ Failed to delete from Cloudinary: ${publicId}`, result);
      return result;
    }
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Delete multiple images from cloudinary
exports.deleteMultipleFromCloudinary = async (publicIds, resourceType = 'image') => {
  try {
    const deletePromises = publicIds.map(publicId => 
      this.deleteFromCloudinary(publicId, resourceType)
    );

    const results = await Promise.allSettled(deletePromises);
    
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.result === 'ok'
    ).length;
    
    const failed = results.length - successful;

    console.log(`🗑️ Cloudinary batch delete: ${successful} deleted, ${failed} failed`);
    
    return {
      successful,
      failed,
      total: publicIds.length,
      results
    };
  } catch (error) {
    console.error('❌ Batch delete error:', error);
    throw new Error('Failed to delete multiple images');
  }
};

// Get cloudinary URL with transformations
exports.getTransformedUrl = (publicId, transformations = {}) => {
  try {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true
    });
  } catch (error) {
    console.error('❌ Get transformed URL error:', error);
    throw new Error('Failed to get transformed URL');
  }
};

// Generate thumbnails for property images
exports.generatePropertyThumbnails = async (publicId) => {
  try {
    const thumbnails = {
      small: this.getTransformedUrl(publicId, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto'
      }),
      medium: this.getTransformedUrl(publicId, {
        width: 600,
        height: 400,
        crop: 'fill',
        quality: 'auto'
      }),
      large: this.getTransformedUrl(publicId, {
        width: 1200,
        height: 800,
        crop: 'fill',
        quality: 'auto'
      })
    };

    return thumbnails;
  } catch (error) {
    console.error('❌ Generate thumbnails error:', error);
    throw new Error('Failed to generate thumbnails');
  }
};

// Upload with auto-optimization for property images
exports.uploadPropertyImage = async (buffer, filename) => {
  try {
    const result = await this.uploadToCloudinary(buffer, {
      folder: 'land-over/properties',
      public_id: `property_${Date.now()}_${filename}`,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Generate thumbnails
    const thumbnails = await this.generatePropertyThumbnails(result.public_id);

    return {
      ...result,
      thumbnails
    };
  } catch (error) {
    console.error('❌ Property image upload error:', error);
    throw new Error('Failed to upload property image');
  }
};

// Upload profile image with optimization
exports.uploadProfileImage = async (buffer, userId) => {
  try {
    const result = await this.uploadToCloudinary(buffer, {
      folder: 'land-over/profiles',
      public_id: `profile_${userId}_${Date.now()}`,
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result;
  } catch (error) {
    console.error('❌ Profile image upload error:', error);
    throw new Error('Failed to upload profile image');
  }
};
