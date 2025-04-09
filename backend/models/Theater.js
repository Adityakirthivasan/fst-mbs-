const mongoose = require('mongoose');

const TheaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity']
  },
  amenities: {
    type: [String],
    enum: [
      'Dolby Atmos',
      'IMAX',
      '3D',
      'Recliner Seats',
      'Food Service',
      'Parking',
      'Wheelchair Accessible'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Theater', TheaterSchema);