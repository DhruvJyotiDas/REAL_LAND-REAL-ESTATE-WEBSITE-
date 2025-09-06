import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LO</span>
              </div>
              <span className="text-xl font-bold">LAND OVER</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted real estate partner. Find, buy, sell, and rent properties with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/buy" className="text-gray-400 hover:text-white transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-white transition-colors">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-gray-400 hover:text-white transition-colors">
                  Rent Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Email: info@landover.com</p>
              <p>Phone: +91 12345 67890</p>
              <p>Address: Mumbai, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 LAND OVER. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
