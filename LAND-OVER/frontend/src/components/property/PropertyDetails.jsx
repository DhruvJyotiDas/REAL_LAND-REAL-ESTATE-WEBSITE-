import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Eye, 
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  Car,
  Wifi,
  Shield,
  Zap,
  Camera,
  ChevronRight
} from 'lucide-react'

import { fetchPropertyById, clearCurrentProperty } from '../../store/slices/propertySlice'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import ImageGallery from '../common/ImageGallery'
import PropertyMap from './PropertyMap'
import Modal from '../common/Modal'
import propertyService from '../../services/propertyService'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useAuth()
  const { currentProperty: property, isLoading } = useSelector((state) => state.property)
  
  const [showContactModal, setShowContactModal] = useState(false)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: user?.firstName + ' ' + user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: `Hi, I'm interested in ${property?.title || 'this property'}. Please contact me with more information.`
  })

  // Amenity icons mapping
  const amenityIcons = {
    parking: Car,
    internet: Wifi,
    security: Shield,
    power_backup: Zap,
    gym: '🏋️',
    swimming_pool: '🏊',
    garden: '🌳',
    elevator: '🛗',
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id))
    }
    
    return () => {
      dispatch(clearCurrentProperty())
    }
  }, [dispatch, id])

  useEffect(() => {
    // Update contact form message when property loads
    if (property) {
      setContactForm(prev => ({
        ...prev,
        message: `Hi, I'm interested in ${property.title}. Please contact me with more information.`
      }))
    }
  }, [property])

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    // TODO: Implement wishlist API call
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm)
    setShowContactModal(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const openImageGallery = (index = 0) => {
    setActiveImageIndex(index)
    setShowImageGallery(true)
  }

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
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWishlistToggle}
                  className="flex items-center"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                  {isInWishlist ? 'Saved' : 'Save'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                {property.images && property.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 h-96">
                    {/* Main Image */}
                    <div className="col-span-2 row-span-2">
                      <img
                        src={property.images[0]?.url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => openImageGallery(0)}
                      />
                    </div>

                    {/* Side Images */}
                    {property.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image?.url}
                          alt={`${property.title} ${index + 2}`}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => openImageGallery(index + 1)}
                        />
                        {/* Show more overlay on last image */}
                        {index === 3 && property.images.length > 5 && (
                          <div
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-colors"
                            onClick={() => openImageGallery(4)}
                          >
                            <div className="text-white text-center">
                              <Camera className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-lg font-semibold">
                                +{property.images.length - 5} Photos
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No images available</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  {property.featured && (
                    <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                  {property.verified && (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location?.address}, {property.location?.city}, {property.location?.state} - {property.location?.pincode}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {propertyService.formatPrice(property.price)}
                  </div>
                  {property.listingType === 'rent' && (
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  )}
                  {property.pricePerSqft && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ₹{property.pricePerSqft}/sqft
                    </div>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                {property.bedrooms !== undefined && (
                  <div className="text-center">
                    <Bed className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
                  </div>
                )}
                
                {property.bathrooms !== undefined && (
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div>
                  </div>
                )}

                {property.area && (
                  <div className="text-center">
                    <Square className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.area.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{property.area.unit}</div>
                  </div>
                )}

                {property.age && (
                  <div className="text-center">
                    <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.age}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Years Old</div>
                  </div>
                )}

                <div className="text-center">
                  <Eye className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.views || 0}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </motion.div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity]
                    return (
                      <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {IconComponent && typeof IconComponent === 'function' ? (
                          <IconComponent className="w-5 h-5 text-primary-600 mr-3" />
                        ) : (
                          <span className="text-lg mr-3">{amenityIcons[amenity] || '•'}</span>
                        )}
                        <span className="text-gray-900 dark:text-white capitalize">
                          {amenity.replace('_', ' ')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Property Type:</span>
                    <span className="text-gray-900 dark:text-white font-medium capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Listing Type:</span>
                    <span className="text-gray-900 dark:text-white font-medium capitalize">{property.listingType}</span>
                  </div>
                  {property.furnished && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Furnished:</span>
                      <span className="text-gray-900 dark:text-white font-medium capitalize">{property.furnished}</span>
                    </div>
                  )}
                  {property.parking !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Parking:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{property.parking} Spaces</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Listed:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Property ID:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{property._id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium capitalize">{property.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            {property.location?.coordinates && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Location
                </h2>
                <div className="h-64 rounded-lg overflow-hidden">
                  <PropertyMap
                    properties={[property]}
                    center={{
                      lat: property.location.coordinates[1],
                      lng: property.location.coordinates[0]
                    }}
                    zoom={15}
                    showSearch={false}
                    height="100%"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Contact Agent
                </h3>
                
                {property.owner && (
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                      {property.owner.profileImage ? (
                        <img
                          src={property.owner.profileImage}
                          alt={`${property.owner.firstName} ${property.owner.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {property.owner.firstName?.[0]}{property.owner.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {property.owner.firstName} {property.owner.lastName}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">Property Owner</p>
                      {property.owner.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{property.owner.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className="w-full flex items-center justify-center"
                    onClick={() => setShowContactModal(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  
                  {property.owner?.phone && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => window.location.href = `tel:${property.owner.phone}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                  
                  {property.owner?.email && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => window.location.href = `mailto:${property.owner.email}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Mortgage Calculator */}
              {property.listingType === 'sale' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Mortgage Calculator
                  </h3>
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Get an estimate of your monthly payments
                    </p>
                    <Button variant="outline">
                      Calculate EMI
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Share This Property
                </h3>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Property
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Agent"
        size="md"
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <input
            type="tel"
            placeholder="Your Phone"
            value={contactForm.phone}
            onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <textarea
            rows={4}
            placeholder="Your Message"
            value={contactForm.message}
            onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setShowContactModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Gallery Modal */}
      {showImageGallery && property.images && (
        <Modal
          isOpen={showImageGallery}
          onClose={() => setShowImageGallery(false)}
          size="full"
          showCloseButton={true}
        >
          <ImageGallery 
            images={property.images}
            className="h-full"
          />
        </Modal>
      )}
    </div>
  )
}

export default PropertyDetails
