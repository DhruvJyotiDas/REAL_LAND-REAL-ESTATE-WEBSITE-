const express = require('express');
const router = express.Router();

// Import controllers
const {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getPropertiesForModeration,
  moderateProperty
} = require('../controllers/admin.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth.middleware');
const { validateUserUpdate } = require('../middleware/validation.middleware');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id', validateUserUpdate, updateUser);
router.delete('/users/:id', deleteUser);

// Property management
router.get('/properties', getPropertiesForModeration);
router.put('/properties/:id/moderate', moderateProperty);

module.exports = router;
