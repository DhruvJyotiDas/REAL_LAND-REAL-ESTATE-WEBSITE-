import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, X, Plus, Minus } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import propertyService from '../../services/propertyService'

const PropertyForm = ({ 
  property = null, 
  onSubmit, 
  loading = false,
  className = ''
}) => {
  const isEditing = !!property
  const [images, setImages] = useState([])
  const [amenities, setAmenities] = useState([])
  const [imageFiles, setImageFiles] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: property || {
      title: '',
      description: '',
      propertyType: 'apartment',
      listingType: 'sale',
      price: '',
      area: {
        value: '',
        unit: 'sqft'
      },
      bedrooms: '',
      bathrooms: '',
      location: {
        address: '',
        city: '',
        state: '',
        pincode: ''
      },
      amenities: [],
      furnished: 'unfurnished',
      parking: 0,
      age: ''
    }
  })

  useEffect(() => {
    if (property) {
      // Set form values if editing
      Object.keys(property).forEach(key => {
        setValue(key, property[key])
      })
      setAmenities(property.amenities || [])
      setImages(property.images || [])
    }
  }, [property, setValue])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(prev => [...prev, ...files])
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages(prev => [...prev, { url: e.target.result, file }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity) => {
    setAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
      setValue('amenities', newAmenities)
      return newAmenities
    })
  }

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      amenities,
      images: imageFiles
    }
    onSubmit(formData)
  }

  const availableAmenities = propertyService.getAmenities()

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={`space-y-6 ${className}`}>
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Property Title"
              required
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
              placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('propertyType', { required: 'Property type is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {propertyService.getPropertyTypes().map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.propertyType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.propertyType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Listing Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('listingType', { required: 'Listing type is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {propertyService.getListingTypes().map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.listingType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.listingType.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Price (₹)"
              type="number"
              required
              {...register('price', { 
                required: 'Price is required',
                min: { value: 1, message: 'Price must be greater than 0' }
              })}
              error={errors.price?.message}
              placeholder="e.g., 5000000"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Area"
              type="number"
              required
              {...register('area.value', { 
                required: 'Area is required',
                min: { value: 1, message: 'Area must be greater than 0' }
              })}
              error={errors.area?.value?.message}
              placeholder="1200"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <select
                {...register('area.unit')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="sqft">Sq Ft</option>
                <option value="sqm">Sq M</option>
                <option value="acres">Acres</option>
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Bedrooms"
              type="number"
              {...register('bedrooms', {
                min: { value: 0, message: 'Bedrooms cannot be negative' }
              })}
              error={errors.bedrooms?.message}
              placeholder="3"
            />
          </div>

          <div>
            <Input
              label="Bathrooms"
              type="number"
              {...register('bathrooms', {
                min: { value: 0, message: 'Bathrooms cannot be negative' }
              })}
              error={errors.bathrooms?.message}
              placeholder="2"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe your property in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Address"
              required
              {...register('location.address', { required: 'Address is required' })}
              error={errors.location?.address?.message}
              placeholder="e.g., 123 Main Street, Sector 5"
            />
          </div>

          <div>
            <Input
              label="City"
              required
              {...register('location.city', { required: 'City is required' })}
              error={errors.location?.city?.message}
              placeholder="e.g., Mumbai"
            />
          </div>

          <div>
            <Input
              label="State"
              required
              {...register('location.state', { required: 'State is required' })}
              error={errors.location?.state?.message}
              placeholder="e.g., Maharashtra"
            />
          </div>

          <div>
            <Input
              label="Pincode"
              required
              {...register('location.pincode', { 
                required: 'Pincode is required',
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: 'Invalid pincode'
                }
              })}
              error={errors.location?.pincode?.message}
              placeholder="e.g., 400001"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Property Images
        </h3>
        
        <div className="space-y-4">
          {/* Upload Button */}
          <div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or GIF (MAX. 10MB each)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Amenities
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableAmenities.map((amenity) => (
            <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={amenities.includes(amenity.value)}
                onChange={() => toggleAmenity(amenity.value)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Additional Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Furnished
            </label>
            <select
              {...register('furnished')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi Furnished</option>
              <option value="furnished">Fully Furnished</option>
            </select>
          </div>

          <div>
            <Input
              label="Parking Spaces"
              type="number"
              {...register('parking', {
                min: { value: 0, message: 'Parking cannot be negative' }
              })}
              error={errors.parking?.message}
              placeholder="1"
            />
          </div>

          <div>
            <Input
              label="Property Age (Years)"
              type="number"
              {...register('age', {
                min: { value: 0, message: 'Age cannot be negative' }
              })}
              error={errors.age?.message}
              placeholder="5"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isEditing ? 'Update Property' : 'List Property'}
        </Button>
      </div>
    </form>
  )
}

export default PropertyForm
