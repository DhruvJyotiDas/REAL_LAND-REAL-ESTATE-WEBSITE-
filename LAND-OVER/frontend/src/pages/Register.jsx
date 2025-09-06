import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { registerUser, clearError } from '../store/slices/authSlice'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'buyer',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const { confirmPassword, ...userData } = formData
    dispatch(registerUser(userData))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LO</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>
            
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I am a <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register
