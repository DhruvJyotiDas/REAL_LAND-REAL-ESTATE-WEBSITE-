import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import propertyService from '@services/propertyService'
import { toast } from 'react-hot-toast'

// Async thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await propertyService.getProperties(params)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch properties'
      return rejectWithValue(message)
    }
  }
)

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertyById(id)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch property'
      return rejectWithValue(message)
    }
  }
)

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await propertyService.createProperty(propertyData)
      toast.success('Property listed successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create property'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updateProperty(id, propertyData)
      toast.success('Property updated successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update property'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id)
      toast.success('Property deleted successfully!')
      return id
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete property'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const uploadPropertyImages = createAsyncThunk(
  'property/uploadPropertyImages',
  async ({ id, images }, { rejectWithValue }) => {
    try {
      const response = await propertyService.uploadImages(id, images)
      toast.success('Images uploaded successfully!')
      return { id, images: response.data.images }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload images'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const searchProperties = createAsyncThunk(
  'property/searchProperties',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await propertyService.searchProperties(searchParams)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Search failed'
      return rejectWithValue(message)
    }
  }
)

export const fetchFeaturedProperties = createAsyncThunk(
  'property/fetchFeaturedProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyService.getFeaturedProperties()
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch featured properties'
      return rejectWithValue(message)
    }
  }
)

export const fetchSimilarProperties = createAsyncThunk(
  'property/fetchSimilarProperties',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await propertyService.getSimilarProperties(propertyId)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch similar properties'
      return rejectWithValue(message)
    }
  }
)

// Initial state
const initialState = {
  properties: [],
  currentProperty: null,
  featuredProperties: [],
  similarProperties: [],
  userProperties: [],
  searchResults: [],
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    state: '',
    amenities: [],
    sortBy: '-featured -createdAt',
  },
  isLoading: false,
  isSearching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isUploading: false,
  error: null,
  searchError: null,
}

// Property slice
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.searchError = null
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchError = null
    },
    clearSimilarProperties: (state) => {
      state.similarProperties = []
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    updatePropertyInList: (state, action) => {
      const { id, updates } = action.payload
      const index = state.properties.findIndex(prop => prop._id === id)
      if (index !== -1) {
        state.properties[index] = { ...state.properties[index], ...updates }
      }
    },
    removePropertyFromList: (state, action) => {
      const id = action.payload
      state.properties = state.properties.filter(prop => prop._id !== id)
      state.userProperties = state.userProperties.filter(prop => prop._id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.properties = action.payload.properties
        state.pagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch property by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProperty = action.payload.property
        state.error = null
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isCreating = false
        state.properties.unshift(action.payload.property)
        state.userProperties.unshift(action.payload.property)
        state.error = null
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isUpdating = false
        const updatedProperty = action.payload.property
        
        // Update in properties list
        const index = state.properties.findIndex(prop => prop._id === updatedProperty._id)
        if (index !== -1) {
          state.properties[index] = updatedProperty
        }
        
        // Update in user properties
        const userIndex = state.userProperties.findIndex(prop => prop._id === updatedProperty._id)
        if (userIndex !== -1) {
          state.userProperties[userIndex] = updatedProperty
        }
        
        // Update current property if it's the same
        if (state.currentProperty?._id === updatedProperty._id) {
          state.currentProperty = updatedProperty
        }
        
        state.error = null
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isDeleting = false
        const deletedId = action.payload
        state.properties = state.properties.filter(prop => prop._id !== deletedId)
        state.userProperties = state.userProperties.filter(prop => prop._id !== deletedId)
        state.error = null
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload
      })
      // Upload property images
      .addCase(uploadPropertyImages.pending, (state) => {
        state.isUploading = true
        state.error = null
      })
      .addCase(uploadPropertyImages.fulfilled, (state, action) => {
        state.isUploading = false
        const { id, images } = action.payload
        
        // Update property images in current property
        if (state.currentProperty?._id === id) {
          state.currentProperty.images = [...state.currentProperty.images, ...images]
        }
        
        // Update in properties list
        const index = state.properties.findIndex(prop => prop._id === id)
        if (index !== -1) {
          state.properties[index].images = [...state.properties[index].images, ...images]
        }
        
        state.error = null
      })
      .addCase(uploadPropertyImages.rejected, (state, action) => {
        state.isUploading = false
        state.error = action.payload
      })
      // Search properties
      .addCase(searchProperties.pending, (state) => {
        state.isSearching = true
        state.searchError = null
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.isSearching = false
        state.searchResults = action.payload.properties
        state.pagination = action.payload.pagination
        state.searchError = null
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.isSearching = false
        state.searchError = action.payload
      })
      // Fetch featured properties
      .addCase(fetchFeaturedProperties.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchFeaturedProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.featuredProperties = action.payload.properties
      })
      .addCase(fetchFeaturedProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch similar properties
      .addCase(fetchSimilarProperties.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSimilarProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.similarProperties = action.payload.properties
      })
      .addCase(fetchSimilarProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  clearCurrentProperty,
  clearSearchResults,
  clearSimilarProperties,
  setFilters,
  resetFilters,
  setLoading,
  updatePropertyInList,
  removePropertyFromList,
} = propertySlice.actions

export default propertySlice.reducer

// Selectors
export const selectProperties = (state) => state.property.properties
export const selectCurrentProperty = (state) => state.property.currentProperty
export const selectFeaturedProperties = (state) => state.property.featuredProperties
export const selectSimilarProperties = (state) => state.property.similarProperties
export const selectUserProperties = (state) => state.property.userProperties
export const selectSearchResults = (state) => state.property.searchResults
export const selectPropertyPagination = (state) => state.property.pagination
export const selectPropertyFilters = (state) => state.property.filters
export const selectPropertyLoading = (state) => state.property.isLoading
export const selectPropertySearching = (state) => state.property.isSearching
export const selectPropertyError = (state) => state.property.error
export const selectSearchError = (state) => state.property.searchError
