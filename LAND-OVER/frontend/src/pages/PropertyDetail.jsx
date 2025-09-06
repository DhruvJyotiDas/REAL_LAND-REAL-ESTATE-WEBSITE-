import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Eye } from 'lucide-react'

import { fetchPropertyById, clearCurrentProperty } from '../store/slices/propertySlice'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import propertyService from '../services/propertyService'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProperty: property, isLoading } = useSelector((state) => state.property)

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id))
    }
    
    return () => {
      dispatch(clearCurrentProperty())
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Property Not Found
          </h2>
          <Button onClick={() => navigate('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      {property.images.slice(1, 5).map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`${property.title} ${index + 2}`}
                          className="w-full h-36 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No images available</span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {property.views || 0} views
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location?.address}, {property.location?.city}, {property.location?.state} - {property.location?.pincode}</span>
              </div>

              <div className="flex items-center space-x-6 mb-6 text-gray-600 dark:text-gray-400">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center">
                    <Square className="w-5 h-5 mr-2" />
                    <span>{property.area.value} {property.area.unit}</span>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold text-primary-600 mb-6">
                {propertyService.formatPrice(property.price)}
                {property.listingType === 'rent' && <span className="text-lg text-gray-500">/month</span>}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                        <span className="capitalize">{amenity.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Agent
              </h3>
              
              {property.owner && (
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {property.owner.firstName?.[0]}{property.owner.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {property.owner.firstName} {property.owner.lastName}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Property Owner</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button className="w-full">
                  Schedule Viewing
                </Button>
                <Button variant="outline" className="w-full">
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Property Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Property Type:</span>
                    <span className="text-gray-900 dark:text-white capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Listing Type:</span>
                    <span className="text-gray-900 dark:text-white capitalize">{property.listingType}</span>
                  </div>
                  {property.age && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Property Age:</span>
                      <span className="text-gray-900 dark:text-white">{property.age} years</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Listed:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
