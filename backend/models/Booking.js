const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: [true, 'Please add number of tickets'],
    min: [1, 'Must book at least 1 ticket']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add total price']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  }
});

// Populate showtime with movie and theater details when queried
BookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'showtime',
    populate: {
      path: 'movie theater',
      select: 'title name location'
    }
  });
  next();
});

// Update available seats in showtime after booking is created
BookingSchema.post('save', async function() {
  try {
    const Showtime = this.model('Showtime');
    await Showtime.findByIdAndUpdate(
      this.showtime,
      { $inc: { availableSeats: -this.numberOfTickets } }
    );
  } catch (err) {
    console.error('Error updating available seats:', err);
  }
});

module.exports = mongoose.model('Booking', BookingSchema);