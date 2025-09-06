// import React, { useState, useEffect, useCallback, useMemo } from 'react'
// import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api'
// import { MapPin, Home, DollarSign, Bed, Bath, Square, X } from 'lucide-react'
// import { Link } from 'react-router-dom'

// import LoadingSpinner from '../ui/LoadingSpinner'
// import Button from '../ui/Button'
// import propertyService from '../../services/propertyService'

// const libraries = ['places']

// const mapContainerStyle = {
//   width: '100%',
//   height: '100%',
// }

// const defaultCenter = {
//   lat: 19.0760, // Mumbai coordinates
//   lng: 72.8777,
// }

// const mapOptions = {
//   disableDefaultUI: false,
//   clickableIcons: false,
//   scrollwheel: true,
//   gestureHandling: 'greedy',
//   zoomControl: true,
//   mapTypeControl: false,
//   streetViewControl: false,
//   fullscreenControl: true,
//   styles: [
//     {
//       featureType: 'poi',
//       elementType: 'labels',
//       stylers: [{ visibility: 'off' }],
//     },
//   ],
// }

// const PropertyMap = ({ 
//   properties = [], 
//   center = defaultCenter,
//   zoom = 10,
//   height = '500px',
//   showSearch = true,
//   onMarkerClick,
//   selectedProperty = null,
//   className = ''
// }) => {
//   const [map, setMap] = useState(null)
//   const [activeMarker, setActiveMarker] = useState(null)
//   const [userLocation, setUserLocation] = useState(null)
//   const [searchBox, setSearchBox] = useState(null)

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   })

//   // Get user's current location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           })
//         },
//         (error) => {
//           console.warn('Error getting user location:', error)
//         }
//       )
//     }
//   }, [])

//   // Handle map load
//   const onMapLoad = useCallback((map) => {
//     setMap(map)
    
//     // Fit bounds to show all properties
//     if (properties.length > 0) {
//       const bounds = new window.google.maps.LatLngBounds()
//       properties.forEach((property) => {
//         if (property.location?.coordinates) {
//           bounds.extend({
//             lat: property.location.coordinates[1],
//             lng: property.location.coordinates[0],
//           })
//         }
//       })
//       map.fitBounds(bounds)
//     }
//   }, [properties])

//   // Handle search box load
//   const onSearchBoxLoad = useCallback((ref) => {
//     setSearchBox(ref)
//   }, [])

//   // Handle places changed
//   const onPlacesChanged = useCallback(() => {
//     if (searchBox) {
//       const places = searchBox.getPlaces()
//       if (places.length > 0) {
//         const place = places[0]
//         const location = place.geometry.location
//         map.panTo({ lat: location.lat(), lng: location.lng() })
//         map.setZoom(14)
//       }
//     }
//   }, [searchBox, map])

//   // Create markers data
//   const markers = useMemo(() => {
//     return properties
//       .filter(property => property.location?.coordinates)
//       .map(property => ({
//         id: property._id,
//         position: {
//           lat: property.location.coordinates[1],
//           lng: property.location.coordinates[0],
//         },
//         property,
//       }))
//   }, [properties])

//   // Handle marker click
//   const handleMarkerClick = useCallback((marker) => {
//     setActiveMarker(marker)
//     if (onMarkerClick) {
//       onMarkerClick(marker.property)
//     }
//   }, [onMarkerClick])

//   // Close info window
//   const closeInfoWindow = useCallback(() => {
//     setActiveMarker(null)
//   }, [])

//   // Custom marker icon
//   const createMarkerIcon = useCallback((property) => {
//     const price = propertyService.formatPrice(property.price)
//     const isSelected = selectedProperty?._id === property._id
    
//     return {
//       url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//         <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
//           <rect x="0" y="0" width="120" height="30" rx="15" fill="${isSelected ? '#ef4444' : '#3b82f6'}" stroke="white" stroke-width="2"/>
//           <text x="60" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${price}</text>
//           <polygon points="55,30 60,40 65,30" fill="${isSelected ? '#ef4444' : '#3b82f6'}"/>
//         </svg>
//       `)}`,
//       scaledSize: new window.google.maps.Size(120, 40),
//       anchor: new window.google.maps.Point(60, 40),
//     }
//   }, [selectedProperty])

//   if (loadError) {
//     return (
//       <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`} style={{ height }}>
//         <div className="text-center">
//           <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             Failed to load map. Please check your Google Maps API key.
//           </p>
//           <Button onClick={() => window.location.reload()}>
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (!isLoaded) {
//     return (
//       <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`} style={{ height }}>
//         <LoadingSpinner size="xl" />
//       </div>
//     )
//   }

//   return (
//     <div className={`relative ${className}`} style={{ height }}>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={zoom}
//         onLoad={onMapLoad}
//         options={mapOptions}
//       >
//         {/* Search Box */}
//         {showSearch && isLoaded && (
//           <div className="absolute top-4 left-4 right-4 z-10">
//             <input
//               ref={onSearchBoxLoad}
//               type="text"
//               placeholder="Search for a location..."
//               className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
//               onChange={onPlacesChanged}
//             />
//           </div>
//         )}

//         {/* User Location Marker */}
//         {userLocation && (
//           <Marker
//             position={userLocation}
//             icon={{
//               url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
//                 <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
//                   <circle cx="10" cy="10" r="3" fill="white"/>
//                 </svg>
//               `)}`,
//               scaledSize: new window.google.maps.Size(20, 20),
//               anchor: new window.google.maps.Point(10, 10),
//             }}
//             title="Your Location"
//           />
//         )}

//         {/* Property Markers */}
//         {markers.map((marker) => (
//           <Marker
//             key={marker.id}
//             position={marker.position}
//             icon={createMarkerIcon(marker.property)}
//             onClick={() => handleMarkerClick(marker)}
//             title={marker.property.title}
//           />
//         ))}

//         {/* Info Window */}
//         {activeMarker && (
//           <InfoWindow
//             position={activeMarker.position}
//             onCloseClick={closeInfoWindow}
//           >
//             <div className="max-w-xs p-0 text-gray-900">
//               <div className="relative">
//                 {/* Property Image */}
//                 <div className="relative h-32 bg-gray-200 rounded-t-lg overflow-hidden">
//                   {activeMarker.property.images?.[0] ? (
//                     <img
//                       src={activeMarker.property.images[0].url}
//                       alt={activeMarker.property.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Home className="w-8 h-8 text-gray-400" />
//                     </div>
//                   )}
                  
//                   {/* Property Type Badge */}
//                   <div className="absolute top-2 left-2">
//                     <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
//                       {activeMarker.property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Property Info */}
//                 <div className="p-3">
//                   <h3 className="font-semibold text-sm mb-2 line-clamp-2">
//                     {activeMarker.property.title}
//                   </h3>

//                   {/* Price */}
//                   <div className="flex items-center mb-2">
//                     <DollarSign className="w-4 h-4 text-green-600 mr-1" />
//                     <span className="font-bold text-primary-600">
//                       {propertyService.formatPrice(activeMarker.property.price)}
//                     </span>
//                     {activeMarker.property.listingType === 'rent' && (
//                       <span className="text-gray-500 text-sm">/month</span>
//                     )}
//                   </div>

//                   {/* Property Details */}
//                   <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
//                     {activeMarker.property.bedrooms && (
//                       <div className="flex items-center">
//                         <Bed className="w-3 h-3 mr-1" />
//                         <span>{activeMarker.property.bedrooms}</span>
//                       </div>
//                     )}
//                     {activeMarker.property.bathrooms && (
//                       <div className="flex items-center">
//                         <Bath className="w-3 h-3 mr-1" />
//                         <span>{activeMarker.property.bathrooms}</span>
//                       </div>
//                     )}
//                     {activeMarker.property.area && (
//                       <div className="flex items-center">
//                         <Square className="w-3 h-3 mr-1" />
//                         <span>{activeMarker.property.area.value} {activeMarker.property.area.unit}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Location */}
//                   <div className="flex items-start mb-3">
//                     <MapPin className="w-3 h-3 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
//                     <span className="text-xs text-gray-600">
//                       {activeMarker.property.location?.city}, {activeMarker.property.location?.state}
//                     </span>
//                   </div>

//                   {/* Action Button */}
//                   <Link to={`/properties/${activeMarker.property._id}`}>
//                     <Button size="sm" className="w-full text-xs">
//                       View Details
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>

//       {/* Map Legend */}
//       <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs">
//         <div className="flex items-center mb-1">
//           <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Available Properties</span>
//         </div>
//         <div className="flex items-center mb-1">
//           <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Selected Property</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Your Location</span>
//         </div>
//       </div>

//       {/* Properties Count */}
//       {properties.length > 0 && (
//         <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
//           {properties.length} Properties
//         </div>
//       )}
//     </div>
//   )
// }

// export default PropertyMap
