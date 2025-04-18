const express = require('express');
const {
  getTheaters,
  getTheater,
  createTheater,
  updateTheater,
  deleteTheater
} = require('../controllers/theaterController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Theater CRUD routes
router
  .route('/')
  .get(getTheaters)
  .post(protect, authorize('admin'), createTheater);

router
  .route('/:id')
  .get(getTheater)
  .put(protect, authorize('admin'), updateTheater)
  .delete(protect, authorize('admin'), deleteTheater);

module.exports = router;