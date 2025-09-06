import React from 'react'
import { cn } from '../../utils/helpers'

const Input = ({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) => {
  const inputClasses = cn(
    'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
    error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400',
    className
  )

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Input
