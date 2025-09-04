import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { 
  selectAuth, 
  selectUser, 
  selectIsAuthenticated,
  getCurrentUser,
  logout as logoutAction,
  clearError 
} from '@store/slices/authSlice'
import authService from '@services/authService'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    const token = authService.getToken()
    
    if (token && !user) {
      try {
        await dispatch(getCurrentUser()).unwrap()
      } catch (error) {
        // Token might be invalid, clear it
        authService.removeToken()
      }
    }
  }, [dispatch, user])

  // Logout user
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap()
      authService.removeToken()
    } catch (error) {
      // Even if logout fails on server, clear local storage
      authService.removeToken()
    }
  }, [dispatch])

  // Clear auth errors
  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role
  }, [user])

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role)
  }, [user])

  // Check if user is verified
  const isVerified = useCallback(() => {
    return user?.isVerified === true
  }, [user])

  // Get user's full name
  const getFullName = useCallback(() => {
    if (!user) return ''
    return `${user.firstName} ${user.lastName}`
  }, [user])

  // Get user's initials
  const getInitials = useCallback(() => {
    if (!user) return ''
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }, [user])

  // Auto-check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    ...auth,
    user,
    isAuthenticated,
    checkAuthStatus,
    logout,
    clearAuthError,
    hasRole,
    hasAnyRole,
    isVerified,
    getFullName,
    getInitials,
  }
}

export default useAuth
