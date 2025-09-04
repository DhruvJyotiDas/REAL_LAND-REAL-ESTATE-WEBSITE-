import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '@services/userService'
import { toast } from 'react-hot-toast'

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile()
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile'
      return rejectWithValue(message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData)
      toast.success('Profile updated successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await userService.uploadProfileImage(imageFile)
      toast.success('Profile image updated!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload image'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const fetchUserProperties = createAsyncThunk(
  'user/fetchUserProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProperties(params)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch properties'
      return rejectWithValue(message)
    }
  }
)

export const fetchWishlist = createAsyncThunk(
  'user/fetchWishlist',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getWishlist(params)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch wishlist'
      return rejectWithValue(message)
    }
  }
)

export const addToWishlist = createAsyncThunk(
  'user/addToWishlist',
  async ({ propertyId, notes }, { rejectWithValue }) => {
    try {
      const response = await userService.addToWishlist(propertyId, notes)
      toast.success('Added to wishlist!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const removeFromWishlist = createAsyncThunk(
  'user/removeFromWishlist',
  async (propertyId, { rejectWithValue }) => {
    try {
      await userService.removeFromWishlist(propertyId)
      toast.success('Removed from wishlist!')
      return propertyId
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const deleteUserAccount = createAsyncThunk(
  'user/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      await userService.deleteAccount()
      toast.success('Account deleted successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

// Initial state
const initialState = {
  profile: null,
  properties: [],
  wishlist: [],
  propertiesPagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  wishlistPagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  isUpdating: false,
  isUploading: false,
  error: null,
  stats: {
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
  },
}

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProfile: (state) => {
      state.profile = null
      state.properties = []
      state.wishlist = []
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    updateProfileInState: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    addPropertyToUserList: (state, action) => {
      state.properties.unshift(action.payload)
      state.stats.totalProperties += 1
    },
    removePropertyFromUserList: (state, action) => {
      const propertyId = action.payload
      state.properties = state.properties.filter(prop => prop._id !== propertyId)
      state.stats.totalProperties = Math.max(0, state.stats.totalProperties - 1)
    },
    updatePropertyInUserList: (state, action) => {
      const { id, updates } = action.payload
      const index = state.properties.findIndex(prop => prop._id === id)
      if (index !== -1) {
        state.properties[index] = { ...state.properties[index], ...updates }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload.user
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false
        state.profile = action.payload.user
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      // Upload profile image
      .addCase(uploadProfileImage.pending, (state) => {
        state.isUploading = true
        state.error = null
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isUploading = false
        if (state.profile) {
          state.profile.profileImage = action.payload.profileImage
        }
        state.error = null
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isUploading = false
        state.error = action.payload
      })
      // Fetch user properties
      .addCase(fetchUserProperties.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.properties = action.payload.properties
        state.propertiesPagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchUserProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.wishlist = action.payload.wishlist
        state.wishlistPagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.wishlist.unshift(action.payload.wishlistItem)
        state.error = null
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        const propertyId = action.payload
        state.wishlist = state.wishlist.filter(
          item => item.property._id !== propertyId
        )
        state.error = null
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete user account
      .addCase(deleteUserAccount.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        // Clear all user data
        state.profile = null
        state.properties = []
        state.wishlist = []
        state.isLoading = false
        state.error = null
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  clearProfile,
  setLoading,
  updateProfileInState,
  addPropertyToUserList,
  removePropertyFromUserList,
  updatePropertyInUserList,
} = userSlice.actions

export default userSlice.reducer

// Selectors
export const selectUserProfile = (state) => state.user.profile
export const selectUserProperties = (state) => state.user.properties
export const selectUserWishlist = (state) => state.user.wishlist
export const selectUserPropertiesPagination = (state) => state.user.propertiesPagination
export const selectUserWishlistPagination = (state) => state.user.wishlistPagination
export const selectUserLoading = (state) => state.user.isLoading
export const selectUserUpdating = (state) => state.user.isUpdating
export const selectUserUploading = (state) => state.user.isUploading
export const selectUserError = (state) => state.user.error
export const selectUserStats = (state) => state.user.stats
