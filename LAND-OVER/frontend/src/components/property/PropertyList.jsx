import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Grid, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PropertyCard from './PropertyCard'
import PropertyFilters from './PropertyFilters'
import SearchBar from '../common/SearchBar'
import Pagination from '../common/Pagination'
import LoadingSpinner from '../ui/LoadingSpinner'
import Button from '../ui/Button'
import { fetchProperties, setFilters, resetFilters } from '../../store/slices/propertySlice'

const PropertyList = ({ 
  showSearch = true,
  showFilters = true,
  showSorting = true,
  showViewToggle = true,
  itemsPerPage = 12,
  className = ''
}) => {
  const dispatch = useDispatch()
  const { 
    properties, 
    filters, 
    pagination, 
    isLoading, 
    error 
  } = useSelector((state) => state.property)
  
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [sortBy, setSortBy] = useState('-featured -createdAt')

  // Sort options
  const sortOptions = [
    { value: '-featured -createdAt', label: 'Featured First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-views', label: 'Most Viewed' },
  ]

  useEffect(() => {
    dispatch(fetchProperties({ 
      ...filters, 
      sort: sortBy,
      limit: itemsPerPage
    }))
  }, [dispatch, filters, sortBy, itemsPerPage])

  const handleFiltersChange = (newFilters) => {
    dispatch(setFilters({ ...newFilters, sort: sortBy }))
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    dispatch(setFilters({ ...filters, sort: newSortBy }))
  }

  const handlePageChange = (page) => {
    dispatch(setFilters({ ...filters, page }))
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (searchData) => {
    dispatch(setFilters({ 
      ...filters, 
      ...searchData, 
      page: 1 
    }))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      {showSearch && (
        <SearchBar onSearch={handleSearch} />
      )}

      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Results Count */}
          <div className="text-gray-600 dark:text-gray-400">
            {isLoading ? (
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <span>
                {pagination.total} properties found
                {filters.city && ` in ${filters.city}`}
              </span>
            )}
          </div>

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          {showSorting && (
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filters Toggle */}
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="flex items-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="xl" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Properties Grid/List */}
      {!isLoading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    showWishlist={true}
                  />
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    showWishlist={true}
                    className="flex flex-col md:flex-row md:h-64"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Empty State */}
      {!isLoading && !error && properties.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-3a1 1 0 011-1h2a1 1 0 011 1v3m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            No Properties Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We couldn't find any properties matching your search criteria. Try adjusting your filters or search in a different location.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleResetFilters}>
              Clear All Filters
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/properties'}>
              Browse All Properties
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination.pages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            showPageNumbers={true}
          />
        </div>
      )}
    </div>
  )
}

export default PropertyList
