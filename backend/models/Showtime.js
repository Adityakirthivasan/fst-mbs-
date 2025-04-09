const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please add available seats']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for movie, theater, and startTime to ensure uniqueness
ShowtimeSchema.index({ movie: 1, theater: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Showtime', ShowtimeSchema);