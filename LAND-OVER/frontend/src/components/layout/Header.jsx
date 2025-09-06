import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { setMobileMenuOpen } from '../../store/slices/uiSlice'
import Button from '../ui/Button'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user, logout } = useAuth()
  const { mobileMenuOpen } = useSelector((state) => state.ui)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    dispatch(setMobileMenuOpen(!mobileMenuOpen))
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LO</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              LAND OVER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/properties"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Properties
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <span>{user.firstName}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/properties"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Properties
              </Link>
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/login" onClick={() => dispatch(setMobileMenuOpen(false))}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => dispatch(setMobileMenuOpen(false))}>
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
