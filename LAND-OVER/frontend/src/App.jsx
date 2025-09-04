import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AppRoutes from './routes/AppRoutes'
import { initializeAuth } from './store/slices/authSlice'
import { useAuth } from './hooks/useAuth'

// Import global styles
import './styles/globals.css'

const App = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.ui)
  const { checkAuthStatus } = useAuth()

  useEffect(() => {
    // Initialize authentication on app start
    dispatch(initializeAuth())
    checkAuthStatus()
  }, [dispatch, checkAuthStatus])

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  )
}

export default App
