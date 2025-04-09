const express = require('express');
const {
  getMyBookings,
  getBooking,
  createBooking,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Routes for regular users
router.get('/me', getMyBookings);
router.post('/', createBooking);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin only routes
router.get('/all', authorize('admin'), getAllBookings);

module.exports = router;