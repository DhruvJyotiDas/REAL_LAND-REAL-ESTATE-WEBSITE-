import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Square, Heart, Eye, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import propertyService from '../../services/propertyService'
import Button from '../ui/Button'

const PropertyCard = ({ 
  property, 
  showWishlist = true, 
  onWishlistToggle,
  isInWishlist = false,
  className = '' 
}) => {
  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onWishlistToggle) {
      onWishlistToggle(property._id)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="relative">
        {/* Property Image */}
        <Link to={`/properties/${property._id}`}>
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={property.images?.[0]?.url || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            
            {/* Image Count */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                <Camera className="w-3 h-3 mr-1" />
                {property.images.length}
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
          {property.verified && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Verified
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        )}

        {/* Quick Stats */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          {property.views || 0}
        </div>
      </div>

      <div className="p-4">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary-600">
            {propertyService.formatPrice(property.price)}
          </span>
          {property.listingType === 'rent' && (
            <span className="text-gray-500 dark:text-gray-400 text-sm">/month</span>
          )}
          {property.pricePerSqft && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ₹{property.pricePerSqft}/sqft
            </div>
          )}
        </div>

        {/* Title */}
        <Link to={`/properties/${property._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.location?.city}, {property.location?.state}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          {property.bedrooms !== undefined && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area.value} {property.area.unit}</span>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm capitalize">
            {property.propertyType}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/properties/${property._id}`} className="flex-1">
            <Button className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="px-3">
            Contact
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard
