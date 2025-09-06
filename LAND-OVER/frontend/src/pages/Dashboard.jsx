import React from 'react'
import { useAuth } from '../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your properties and account from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              My Properties
            </h3>
            <p className="text-3xl font-bold text-primary-600">0</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active listings</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Views
            </h3>
            <p className="text-3xl font-bold text-secondary-600">0</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">This month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Inquiries
            </h3>
            <p className="text-3xl font-bold text-yellow-600">0</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">New inquiries</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Wishlist
            </h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Saved properties</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white">Add Property</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">List a new property</p>
            </button>
            
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white">View Properties</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your listings</p>
            </button>
            
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Update your profile</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
