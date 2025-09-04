import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false,
  authModalOpen: false,
  authModalType: 'login', // 'login' | 'register'
  imageModalOpen: false,
  imageModalImages: [],
  imageModalCurrentIndex: 0,
  notifications: [],
  loading: {
    global: false,
    page: false,
    component: {},
  },
  toast: {
    show: false,
    message: '',
    type: 'info', // 'success' | 'error' | 'warning' | 'info'
  },
  modals: {
    deleteConfirm: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
    },
    propertyForm: {
      open: false,
      mode: 'create', // 'create' | 'edit'
      propertyId: null,
    },
    profileEdit: {
      open: false,
    },
    contactForm: {
      open: false,
      propertyId: null,
    },
  },
  filters: {
    showAdvanced: false,
    quickFilters: {
      propertyType: '',
      priceRange: '',
      bedrooms: '',
    },
  },
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
    
    // Sidebar
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    // Mobile Menu
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    
    // Search Modal
    setSearchModalOpen: (state, action) => {
      state.searchModalOpen = action.payload
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen
    },
    
    // Auth Modal
    setAuthModalOpen: (state, action) => {
      state.authModalOpen = action.payload
      if (!action.payload) {
        state.authModalType = 'login'
      }
    },
    setAuthModalType: (state, action) => {
      state.authModalType = action.payload
    },
    openAuthModal: (state, action) => {
      state.authModalOpen = true
      state.authModalType = action.payload || 'login'
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false
      state.authModalType = 'login'
    },
    
    // Image Modal
    openImageModal: (state, action) => {
      state.imageModalOpen = true
      state.imageModalImages = action.payload.images || []
      state.imageModalCurrentIndex = action.payload.currentIndex || 0
    },
    closeImageModal: (state) => {
      state.imageModalOpen = false
      state.imageModalImages = []
      state.imageModalCurrentIndex = 0
    },
    setImageModalIndex: (state, action) => {
      state.imageModalCurrentIndex = action.payload
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }
      state.notifications.unshift(notification)
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    
    // Loading
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload
    },
    setPageLoading: (state, action) => {
      state.loading.page = action.payload
    },
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload
      state.loading.component[component] = loading
    },
    
    // Toast
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      }
    },
    hideToast: (state) => {
      state.toast.show = false
    },
    
    // Modals
    openModal: (state, action) => {
      const { modal, data = {} } = action.payload
      if (state.modals[modal]) {
        state.modals[modal] = { ...state.modals[modal], open: true, ...data }
      }
    },
    closeModal: (state, action) => {
      const modal = action.payload
      if (state.modals[modal]) {
        state.modals[modal].open = false
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal].open = false
      })
    },
    
    // Filters
    setShowAdvancedFilters: (state, action) => {
      state.filters.showAdvanced = action.payload
    },
    setQuickFilter: (state, action) => {
      const { filter, value } = action.payload
      state.filters.quickFilters[filter] = value
    },
    resetQuickFilters: (state) => {
      state.filters.quickFilters = {
        propertyType: '',
        priceRange: '',
        bedrooms: '',
      }
    },
    
    // Viewport
    setViewport: (state, action) => {
      const { width, height } = action.payload
      state.viewport = {
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      }
      
      // Auto close mobile menu on desktop
      if (width >= 1024) {
        state.mobileMenuOpen = false
      }
    },
  },
})

export const {
  // Theme
  setTheme,
  toggleTheme,
  
  // Sidebar
  setSidebarOpen,
  toggleSidebar,
  
  // Mobile Menu
  setMobileMenuOpen,
  toggleMobileMenu,
  
  // Search Modal
  setSearchModalOpen,
  toggleSearchModal,
  
  // Auth Modal
  setAuthModalOpen,
  setAuthModalType,
  openAuthModal,
  closeAuthModal,
  
  // Image Modal
  openImageModal,
  closeImageModal,
  setImageModalIndex,
  
  // Notifications
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Loading
  setGlobalLoading,
  setPageLoading,
  setComponentLoading,
  
  // Toast
  showToast,
  hideToast,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Filters
  setShowAdvancedFilters,
  setQuickFilter,
  resetQuickFilters,
  
  // Viewport
  setViewport,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectTheme = (state) => state.ui.theme
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectSearchModalOpen = (state) => state.ui.searchModalOpen
export const selectAuthModal = (state) => ({
  open: state.ui.authModalOpen,
  type: state.ui.authModalType,
})
export const selectImageModal = (state) => ({
  open: state.ui.imageModalOpen,
  images: state.ui.imageModalImages,
  currentIndex: state.ui.imageModalCurrentIndex,
})
export const selectNotifications = (state) => state.ui.notifications
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read)
export const selectLoading = (state) => state.ui.loading
export const selectToast = (state) => state.ui.toast
export const selectModals = (state) => state.ui.modals
export const selectFilters = (state) => state.ui.filters
export const selectViewport = (state) => state.ui.viewport
