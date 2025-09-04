const { cloudinary } = require('../config/cloudinary.config');
const streamifier = require('streamifier');

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer from multer
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise} - Cloudinary upload result
 */
const uploadImage = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      flags: 'progressive'
    };

    const uploadOptions = { ...defaultOptions, ...options };

    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('✅ Image uploaded to Cloudinary:', result.public_id);
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} buffers - Array of image buffers
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise} - Array of upload results
 */
const uploadMultipleImages = async (buffers, options = {}) => {
  try {
    const uploadPromises = buffers.map((buffer, index) => {
      const imageOptions = {
        ...options,
        public_id: options.public_id ? 
          `${options.public_id}_${Date.now()}_${index}` : 
          `img_${Date.now()}_${index}`
      };
      return uploadImage(buffer, imageOptions);
    });

    const results = await Promise.all(uploadPromises);
    console.log(`✅ Successfully uploaded ${results.length} images to Cloudinary`);
    return results;
  } catch (error) {
    console.error('❌ Multiple image upload failed:', error);
    throw new Error(`Failed to upload multiple images: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image to delete
 * @param {String} resourceType - Type of resource (image, video, raw)
 * @returns {Promise} - Deletion result
 */
const deleteImage = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok') {
      console.log(`✅ Successfully deleted from Cloudinary: ${publicId}`);
      return { success: true, result };
    } else if (result.result === 'not found') {
      console.warn(`⚠️ Image not found in Cloudinary: ${publicId}`);
      return { success: false, error: 'Image not found', result };
    } else {
      console.warn(`⚠️ Failed to delete from Cloudinary: ${publicId}`, result);
      return { success: false, error: 'Deletion failed', result };
    }
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of public IDs to delete
 * @param {String} resourceType - Type of resource
 * @returns {Promise} - Batch deletion result
 */
const deleteMultipleImages = async (publicIds, resourceType = 'image') => {
  try {
    // Use Cloudinary's batch delete for better performance
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType
    });

    const deleted = Object.keys(result.deleted).length;
    const notFound = Object.keys(result.not_found || {}).length;
    const partial = Object.keys(result.partial || {}).length;

    console.log(`🗑️ Batch delete completed: ${deleted} deleted, ${notFound} not found, ${partial} partial`);

    return {
      success: true,
      deleted,
      notFound,
      partial,
      details: result
    };
  } catch (error) {
    console.error('❌ Batch delete error:', error);
    throw new Error(`Failed to delete multiple images: ${error.message}`);
  }
};

/**
 * Generate optimized image URL with transformations
 * @param {String} publicId - Public ID of the image
 * @param {Object} transformations - Transformation options
 * @returns {String} - Optimized image URL
 */
const getOptimizedUrl = (publicId, transformations = {}) => {
  try {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto'
    };

    const finalTransformations = { ...defaultTransformations, ...transformations };

    return cloudinary.url(publicId, {
      ...finalTransformations,
      secure: true
    });
  } catch (error) {
    console.error('❌ Get optimized URL error:', error);
    throw new Error('Failed to generate optimized URL');
  }
};

/**
 * Generate responsive image URLs for different screen sizes
 * @param {String} publicId - Public ID of the image
 * @returns {Object} - Object containing different sized URLs
 */
const generateResponsiveUrls = (publicId) => {
  try {
    return {
      thumbnail: getOptimizedUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
      small: getOptimizedUrl(publicId, { width: 300, height: 200, crop: 'fill' }),
      medium: getOptimizedUrl(publicId, { width: 600, height: 400, crop: 'fill' }),
      large: getOptimizedUrl(publicId, { width: 1200, height: 800, crop: 'fill' }),
      original: getOptimizedUrl(publicId)
    };
  } catch (error) {
    console.error('❌ Generate responsive URLs error:', error);
    throw new Error('Failed to generate responsive URLs');
  }
};

/**
 * Upload property image with specific optimizations
 * @param {Buffer} buffer - Image buffer
 * @param {String} propertyId - Property ID for naming
 * @param {Number} index - Image index
 * @returns {Promise} - Upload result with responsive URLs
 */
const uploadPropertyImage = async (buffer, propertyId, index = 0) => {
  try {
    const options = {
      folder: 'land-over/properties',
      public_id: `property_${propertyId}_${Date.now()}_${index}`,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      tags: ['property', 'land-over']
    };

    const result = await uploadImage(buffer, options);
    
    // Generate responsive URLs
    const responsiveUrls = generateResponsiveUrls(result.public_id);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      responsive_urls: responsiveUrls,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('❌ Property image upload error:', error);
    throw new Error('Failed to upload property image');
  }
};

/**
 * Upload profile image with circular crop
 * @param {Buffer} buffer - Image buffer
 * @param {String} userId - User ID for naming
 * @returns {Promise} - Upload result
 */
const uploadProfileImage = async (buffer, userId) => {
  try {
    const options = {
      folder: 'land-over/profiles',
      public_id: `profile_${userId}_${Date.now()}`,
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { radius: 'max' }, // Make it circular
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      tags: ['profile', 'land-over']
    };

    const result = await uploadImage(buffer, options);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('❌ Profile image upload error:', error);
    throw new Error('Failed to upload profile image');
  }
};

/**
 * Get image metadata from Cloudinary
 * @param {String} publicId - Public ID of the image
 * @returns {Promise} - Image metadata
 */
const getImageMetadata = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
      tags: result.tags || []
    };
  } catch (error) {
    console.error('❌ Get image metadata error:', error);
    throw new Error('Failed to get image metadata');
  }
};

/**
 * Search images in Cloudinary by tags
 * @param {Array} tags - Array of tags to search
 * @param {Object} options - Search options
 * @returns {Promise} - Search results
 */
const searchImagesByTags = async (tags, options = {}) => {
  try {
    const searchOptions = {
      expression: `tags:${tags.join(' AND tags:')}`,
      max_results: options.max_results || 50,
      sort_by: options.sort_by || [{ created_at: 'desc' }]
    };

    const result = await cloudinary.search.execute();
    return result.resources;
  } catch (error) {
    console.error('❌ Search images error:', error);
    throw new Error('Failed to search images');
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedUrl,
  generateResponsiveUrls,
  uploadPropertyImage,
  uploadProfileImage,
  getImageMetadata,
  searchImagesByTags
};
