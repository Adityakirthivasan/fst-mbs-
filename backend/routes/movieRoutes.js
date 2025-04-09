const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getFeaturedMovies
} = require('../controllers/movieController');
const { getShowtimesByMovie } = require('../controllers/showtimeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Featured movies route
router.get('/featured', getFeaturedMovies);

// Showtimes for a specific movie
router.get('/:movieId/showtimes', getShowtimesByMovie);

// Movie CRUD routes
router
  .route('/')
  .get(getMovies)
  .post(protect, authorize('admin'), createMovie);

router
  .route('/:id')
  .get(getMovie)
  .put(protect, authorize('admin'), updateMovie)
  .delete(protect, authorize('admin'), deleteMovie);

module.exports = router;