import React, { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import propertyService from '../../services/propertyService'

const PropertyFilters = ({ 
  filters, 
  onFiltersChange, 
  onResetFilters,
  className = '' 
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const propertyTypes = propertyService.getPropertyTypes()
  const listingTypes = propertyService.getListingTypes()
  
  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-2500000', label: 'Under ₹25 Lakh' },
    { value: '2500000-5000000', label: '₹25L - ₹50L' },
    { value: '5000000-10000000', label: '₹50L - ₹1 Cr' },
    { value: '10000000-25000000', label: '₹1 Cr - ₹2.5 Cr' },
    { value: '25000000-', label: 'Above ₹2.5 Cr' },
  ]

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      propertyType: '',
      listingType: '',
      priceRange: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      state: '',
    }
    setLocalFilters(resetFilters)
    onResetFilters()
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Filter Toggle Button (Mobile) */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </div>
          {showFilters ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`p-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Type
            </label>
            <select
              value={localFilters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Listing Type
            </label>
            <select
              value={localFilters.listingType}
              onChange={(e) => handleFilterChange('listingType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All</option>
              {listingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range
            </label>
            <select
              value={localFilters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bedrooms
            </label>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {bedroomOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <Input
              type="text"
              placeholder="Enter city"
              value={localFilters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <Input
              type="text"
              placeholder="Enter state"
              value={localFilters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={applyFilters} className="sm:flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters} className="sm:flex-1">
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyFilters
