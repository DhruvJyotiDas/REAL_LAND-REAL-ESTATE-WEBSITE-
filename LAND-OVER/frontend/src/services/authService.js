import { apiMethods } from './api'

class AuthService {
  // Register new user
  async register(userData) {
    return await apiMethods.post('/auth/register', userData)
  }

  // Login user
  async login(credentials) {
    return await apiMethods.post('/auth/login', credentials)
  }

  // Logout user
  async logout() {
    return await apiMethods.post('/auth/logout')
  }

  // Get current user
  async getCurrentUser() {
    return await apiMethods.get('/auth/me')
  }

  // Verify email
  async verifyEmail(token) {
    return await apiMethods.put(`/auth/verify-email/${token}`)
  }

  // Forgot password
  async forgotPassword(email) {
    return await apiMethods.post('/auth/forgot-password', { email })
  }

  // Reset password
  async resetPassword(token, password) {
    return await apiMethods.put(`/auth/reset-password/${token}`, { password })
  }

  // Update password
  async updatePassword(passwordData) {
    return await apiMethods.put('/auth/update-password', passwordData)
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    return await apiMethods.post('/auth/resend-verification', { email })
  }

  // Refresh token
  async refreshToken() {
    return await apiMethods.post('/auth/refresh-token')
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token')
  }

  // Set auth token
  setToken(token) {
    localStorage.setItem('token', token)
  }

  // Remove auth token
  removeToken() {
    localStorage.removeItem('token')
  }
}

export default new AuthService()
