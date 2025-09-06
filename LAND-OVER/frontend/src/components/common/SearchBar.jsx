import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const SearchBar = ({ className = '', onSearch }) => {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    query: '',
    location: '',
    propertyType: '',
    priceRange: ''
  })

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (onSearch) {
      onSearch(searchData)
    } else {
      // Navigate to properties page with search params
      const params = new URLSearchParams()
      Object.entries(searchData).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })
      navigate(`/properties?${params.toString()}`)
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Query */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="query"
                type="text"
                placeholder="Search properties, locations..."
                value={searchData.query}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="location"
                type="text"
                placeholder="Location"
                value={searchData.location}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <select
              name="propertyType"
              value={searchData.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price Range */}
          <div>
            <select
              name="priceRange"
              value={searchData.priceRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Any Price</option>
              <option value="0-2500000">Under ₹25 Lakh</option>
              <option value="2500000-5000000">₹25L - ₹50L</option>
              <option value="5000000-10000000">₹50L - ₹1 Cr</option>
              <option value="10000000-25000000">₹1 Cr - ₹2.5 Cr</option>
              <option value="25000000-">Above ₹2.5 Cr</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search Properties
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
