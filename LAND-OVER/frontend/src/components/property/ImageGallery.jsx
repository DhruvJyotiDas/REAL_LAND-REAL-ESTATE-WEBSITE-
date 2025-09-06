import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ImageGallery = ({ images = [], className = '', autoPlay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        )
      }, 4000)
      
      return () => clearInterval(interval)
    }
  }, [autoPlay, images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isFullscreen) return
      
      if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      } else if (e.key === 'Escape') {
        closeFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen])

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
    setIsZoomed(false)
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = images[currentIndex]?.url || images[currentIndex]
    link.download = `property-image-${currentIndex + 1}.jpg`
    link.click()
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        {/* Main Image Container */}
        <div 
          className="relative aspect-w-16 aspect-h-9"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]?.url || images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              className="w-full h-64 md:h-80 lg:h-96 object-cover cursor-pointer"
              onClick={openFullscreen}
            />
          </AnimatePresence>
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 group">
            {/* Zoom Button */}
            <button
              onClick={openFullscreen}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity opacity-0 group-hover:opacity-100"
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

            {/* Auto-play indicator */}
            {autoPlay && (
              <div className="absolute bottom-4 left-4 flex space-x-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-white' 
                        : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto scrollbar-thin pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
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
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ duration: 0.3 }}
                src={images[currentIndex]?.url || images[currentIndex]}
                alt={`Property image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsZoomed(!isZoomed)
                }}
              />

              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="text-white text-lg font-semibold">
                  {currentIndex + 1} / {images.length}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadImage()
                    }}
                    className="text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={closeFullscreen}
                    className="text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Bottom thumbnail strip */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
                  {images.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, index) => {
                    const actualIndex = Math.max(0, currentIndex - 2) + index
                    return (
                      <button
                        key={actualIndex}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentIndex(actualIndex)
                        }}
                        className={`w-12 h-12 rounded-md overflow-hidden border-2 ${
                          actualIndex === currentIndex 
                            ? 'border-white' 
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image?.url || image}
                          alt={`Thumbnail ${actualIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
