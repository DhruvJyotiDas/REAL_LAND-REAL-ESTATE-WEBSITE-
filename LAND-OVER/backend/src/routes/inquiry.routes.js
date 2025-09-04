const express = require('express');
const router = express.Router();

// Import controllers
const {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  respondToInquiry,
  scheduleMeeting,
  updateInquiryStatus
} = require('../controllers/inquiry.controller');

// Import middleware
const { protect } = require('../middleware/auth.middleware');
const { validateInquiry } = require('../middleware/validation.middleware');

// All routes are protected
router.use(protect);

// Inquiry routes
router.post('/', validateInquiry, createInquiry);
router.get('/sent', getSentInquiries);
router.get('/received', getReceivedInquiries);

// Individual inquiry routes
router.put('/:id/respond', respondToInquiry);
router.put('/:id/schedule', scheduleMeeting);
router.put('/:id/status', updateInquiryStatus);

module.exports = router;
