import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
