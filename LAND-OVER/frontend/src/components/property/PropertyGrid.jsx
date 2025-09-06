import React from 'react'
import PropertyCard from './PropertyCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import { motion } from 'framer-motion'

const PropertyGrid = ({ 
  properties = [], 
  loading = false, 
  error = null,
  showWishlist = true,
  onWishlistToggle,
  wishlistedProperties = [],
  className = ''
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Try again
        </button>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-3a1 1 0 011-1h2a1 1 0 011 1v3m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Properties Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          We couldn't find any properties matching your criteria.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Try adjusting your search filters or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {properties.map((property, index) => (
          <motion.div
            key={property._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <PropertyCard
              property={property}
              showWishlist={showWishlist}
              onWishlistToggle={onWishlistToggle}
              isInWishlist={wishlistedProperties.includes(property._id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default PropertyGrid
