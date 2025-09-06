import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, Bed, Bath, Square } from 'lucide-react'

import { fetchProperties, setFilters } from '../store/slices/propertySlice'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import propertyService from '../services/propertyService'

const Properties = () => {
  const dispatch = useDispatch()
  const { properties, filters, isLoading, pagination } = useSelector((state) => state.property)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchProperties(filters))
  }, [dispatch, filters])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ ...filters, search: searchQuery }))
  }

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ ...filters, [key]: value }))
  }

  const propertyTypes = propertyService.getPropertyTypes()
  const listingTypes = propertyService.getListingTypes()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Properties
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search properties by location, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Listing Type
                  </label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All</option>
                    {listingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <div key={property._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    {property.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location?.city}, {property.location?.state}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
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

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {propertyService.formatPrice(property.price)}
                      </span>
                      <Link to={`/properties/${property._id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {pagination.hasPrev && (
                    <Button
                      variant="outline"
                      onClick={() => handleFilterChange('page', pagination.current - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <span className="text-gray-600 dark:text-gray-400">
                    Page {pagination.current} of {pagination.pages}
                  </span>
                  
                  {pagination.hasNext && (
                    <Button
                      variant="outline"
                      onClick={() => handleFilterChange('page', pagination.current + 1)}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}

            {properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No properties found. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Properties
