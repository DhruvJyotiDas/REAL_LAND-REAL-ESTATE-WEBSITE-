import { apiMethods, uploadApi } from './api'

class UserService {
  // Get user profile
  async getProfile() {
    return await apiMethods.get('/users/profile')
  }

  // Update user profile
  async updateProfile(profileData) {
    return await apiMethods.put('/users/profile', profileData)
  }

  // Upload profile image
  async uploadProfileImage(imageFile, onUploadProgress) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return await uploadApi.post('/users/profile/image', formData, onUploadProgress)
  }

  // Get user properties
  async getUserProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await apiMethods.get(`/users/properties?${queryString}`)
  }

  // Get user wishlist
  async getWishlist(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await apiMethods.get(`/users/wishlist?${queryString}`)
  }

  // Add property to wishlist
  async addToWishlist(propertyId, notes = '') {
    return await apiMethods.post(`/users/wishlist/${propertyId}`, { notes })
  }

  // Remove property from wishlist
  async removeFromWishlist(propertyId) {
    return await apiMethods.delete(`/users/wishlist/${propertyId}`)
  }

  // Delete user account
  async deleteAccount() {
    return await apiMethods.delete('/users/account')
  }

  // Get user dashboard stats
  async getDashboardStats() {
    return await apiMethods.get('/users/dashboard/stats')
  }

  // Update user preferences
  async updatePreferences(preferences) {
    return await apiMethods.put('/users/preferences', preferences)
  }

  // Get user notifications
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await apiMethods.get(`/users/notifications?${queryString}`)
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    return await apiMethods.put(`/users/notifications/${notificationId}/read`)
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    return await apiMethods.put('/users/notifications/mark-all-read')
  }

  // Delete notification
  async deleteNotification(notificationId) {
    return await apiMethods.delete(`/users/notifications/${notificationId}`)
  }
}

export default new UserService()
