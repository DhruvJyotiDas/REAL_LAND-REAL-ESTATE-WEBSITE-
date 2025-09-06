import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ImageGallery = ({ images = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <span className="text-gray-500 dark:text-gray-400">No images available</span>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        {/* Main Image */}
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={images[currentIndex]?.url || images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            className="w-full h-64 md:h-80 object-cover cursor-pointer"
            onClick={openFullscreen}
          />
          
          {/* Zoom Button */}
          <button
            onClick={openFullscreen}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto scrollbar-thin">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary-500 opacity-100' 
                    : 'border-gray-300 dark:border-gray-600 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image?.url || image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative max-w-full max-h-full p-4">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={images[currentIndex]?.url || images[currentIndex]}
                alt={`Property image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Close Button */}
              <button
                onClick={closeFullscreen}
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter in Fullscreen */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
