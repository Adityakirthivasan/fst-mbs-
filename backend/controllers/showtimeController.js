const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');

// @desc    Get all showtimes
// @route   GET /api/showtimes
// @access  Public
exports.getShowtimes = async (req, res) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Showtime.find(JSON.parse(queryStr))
      .populate({
        path: 'movie',
        select: 'title genre duration posterUrl'
      })
      .populate({
        path: 'theater',
        select: 'name location'
      });
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('startTime');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Showtime.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const showtimes = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: showtimes.length,
      pagination,
      data: showtimes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single showtime
// @route   GET /api/showtimes/:id
// @access  Public
exports.getShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate({
        path: 'movie',
        select: 'title description genre duration posterUrl'
      })
      .populate({
        path: 'theater',
        select: 'name location capacity amenities'
      });
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    res.status(200).json({
      success: true,
      data: showtime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new showtime
// @route   POST /api/showtimes
// @access  Private (Admin only)
exports.createShowtime = async (req, res) => {
  try {
    // Check if movie exists
    const movie = await Movie.findById(req.body.movie);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Check if theater exists
    const theater = await Theater.findById(req.body.theater);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    // Set available seats to theater capacity if not provided
    if (!req.body.availableSeats) {
      req.body.availableSeats = theater.capacity;
    }
    
    // Create showtime
    const showtime = await Showtime.create(req.body);
    
    res.status(201).json({
      success: true,
      data: showtime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update showtime
// @route   PUT /api/showtimes/:id
// @access  Private (Admin only)
exports.updateShowtime = async (req, res) => {
  try {
    let showtime = await Showtime.findById(req.params.id);
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: showtime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete showtime
// @route   DELETE /api/showtimes/:id
// @access  Private (Admin only)
exports.deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    await showtime.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get showtimes for a movie
// @route   GET /api/movies/:movieId/showtimes
// @access  Public
exports.getShowtimesByMovie = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movie: req.params.movieId })
      .populate({
        path: 'theater',
        select: 'name location'
      })
      .sort('startTime');
    
    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};