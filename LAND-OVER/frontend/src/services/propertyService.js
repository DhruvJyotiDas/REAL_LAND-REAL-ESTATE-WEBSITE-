import { apiMethods, uploadApi } from './api'

class PropertyService {
  // Get all properties with filters
  async getProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await apiMethods.get(`/properties?${queryString}`)
  }

  // Get property by ID
  async getPropertyById(id) {
    return await apiMethods.get(`/properties/${id}`)
  }

  // Create new property
  async createProperty(propertyData) {
    return await apiMethods.post('/properties', propertyData)
  }

  // Update property
  async updateProperty(id, propertyData) {
    return await apiMethods.put(`/properties/${id}`, propertyData)
  }

  // Delete property
  async deleteProperty(id) {
    return await apiMethods.delete(`/properties/${id}`)
  }

  // Upload property images
  async uploadImages(id, images, onUploadProgress) {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append('images', image)
    })
    
    return await uploadApi.post(
      `/properties/${id}/images`, 
      formData, 
      onUploadProgress
    )
  }

  // Search properties
  async searchProperties(searchParams) {
    const queryString = new URLSearchParams(searchParams).toString()
    return await apiMethods.get(`/properties/search?${queryString}`)
  }

  // Get featured properties
  async getFeaturedProperties() {
    return await apiMethods.get('/properties?featured=true&limit=8')
  }

  // Get similar properties
  async getSimilarProperties(propertyId) {
    return await apiMethods.get(`/properties/${propertyId}/similar`)
  }

  // Get trending properties
  async getTrendingProperties(limit = 10) {
    return await apiMethods.get(`/properties?sort=-views&limit=${limit}`)
  }

  // Get properties by location
  async getPropertiesByLocation(city, state) {
    return await apiMethods.get(`/properties?city=${city}&state=${state}`)
  }

  // Get property statistics
  async getPropertyStats() {
    return await apiMethods.get('/properties/stats')
  }

  // Get property types
  getPropertyTypes() {
    return [
      { value: 'apartment', label: 'Apartment' },
      { value: 'house', label: 'House' },
      { value: 'villa', label: 'Villa' },
      { value: 'plot', label: 'Plot' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'office', label: 'Office' },
      { value: 'shop', label: 'Shop' },
    ]
  }

  // Get listing types
  getListingTypes() {
    return [
      { value: 'sale', label: 'For Sale' },
      { value: 'rent', label: 'For Rent' },
    ]
  }

  // Get amenities list
  getAmenities() {
    return [
      { value: 'parking', label: 'Parking' },
      { value: 'gym', label: 'Gym' },
      { value: 'swimming_pool', label: 'Swimming Pool' },
      { value: 'garden', label: 'Garden' },
      { value: 'security', label: '24/7 Security' },
      { value: 'power_backup', label: 'Power Backup' },
      { value: 'elevator', label: 'Elevator' },
      { value: 'water_supply', label: '24/7 Water Supply' },
      { value: 'internet', label: 'Internet' },
      { value: 'air_conditioning', label: 'Air Conditioning' },
      { value: 'balcony', label: 'Balcony' },
      { value: 'terrace', label: 'Terrace' },
      { value: 'store_room', label: 'Store Room' },
      { value: 'servant_room', label: 'Servant Room' },
      { value: 'study_room', label: 'Study Room' },
      { value: 'pooja_room', label: 'Pooja Room' },
      { value: 'library', label: 'Library' },
      { value: 'club_house', label: 'Club House' },
      { value: 'playground', label: 'Playground' },
      { value: 'medical_facility', label: 'Medical Facility' },
    ]
  }

  // Format price for display
  formatPrice(price) {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)} K`
    }
    return `₹${price}`
  }

  // Calculate price per sqft
  calculatePricePerSqft(price, area, unit = 'sqft') {
    let areaInSqft = area
    
    if (unit === 'sqm') {
      areaInSqft = area * 10.764
    } else if (unit === 'acres') {
      areaInSqft = area * 43560
    }
    
    return Math.round(price / areaInSqft)
  }
}

export default new PropertyService()
