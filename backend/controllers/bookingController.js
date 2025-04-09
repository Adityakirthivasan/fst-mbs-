const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// @desc    Get all bookings for current user
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort('-bookingDate');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this booking' });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check if showtime exists and has enough seats
    const showtime = await Showtime.findById(req.body.showtime);
    
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    if (showtime.availableSeats < req.body.numberOfTickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    
    // Calculate total price
    req.body.totalPrice = showtime.price * req.body.numberOfTickets;
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Update booking status to cancelled
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true, runValidators: true }
    );
    
    // Update available seats in showtime
    await Showtime.findByIdAndUpdate(
      booking.showtime,
      { $inc: { availableSeats: booking.numberOfTickets } }
    );
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings/all
// @access  Private (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort('-bookingDate');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};