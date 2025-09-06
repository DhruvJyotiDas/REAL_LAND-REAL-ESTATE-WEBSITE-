export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PROPERTIES: {
    BASE: '/properties',
    SEARCH: '/properties/search',
    FEATURED: '/properties?featured=true',
  },
  USERS: {
    PROFILE: '/users/profile',
    PROPERTIES: '/users/properties',
    WISHLIST: '/users/wishlist',
  },
}

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
]

export const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
]

export const USER_ROLES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'agent', label: 'Agent' },
]

export const AMENITIES = [
  { value: 'parking', label: 'Parking' },
  { value: 'gym', label: 'Gym' },
  { value: 'swimming_pool', label: 'Swimming Pool' },
  { value: 'garden', label: 'Garden' },
  { value: 'security', label: '24/7 Security' },
  { value: 'power_backup', label: 'Power Backup' },
  { value: 'elevator', label: 'Elevator' },
  { value: 'water_supply', label: '24/7 Water Supply' },
]

export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
}
