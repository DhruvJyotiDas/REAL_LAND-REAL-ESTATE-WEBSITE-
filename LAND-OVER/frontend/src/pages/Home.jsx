import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search, Home as HomeIcon, TrendingUp, Users } from 'lucide-react'

import { fetchProperties } from '../store/slices/propertySlice'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Home = () => {
  const dispatch = useDispatch()
  const { featuredProperties, isLoading } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(fetchProperties({ featured: true, limit: 6 }))
  }, [dispatch])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover thousands of properties, connect with trusted agents, and make your real estate dreams come true
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10K+</h3>
              <p className="text-gray-600 dark:text-gray-400">Properties Listed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50K+</h3>
              <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">98%</h3>
              <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <div key={property._id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {property.location?.city}, {property.location?.state}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{property.price?.toLocaleString()}
                      </span>
                      <Link to={`/properties/${property._id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button size="lg">View All Properties</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with LAND OVER
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
