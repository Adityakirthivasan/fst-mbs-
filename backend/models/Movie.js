const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
    enum: [
      'Action',
      'Adventure',
      'Animation',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Horror',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Thriller',
      'War'
    ]
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please add a release date']
  },
  posterUrl: {
    type: String,
    default: 'no-image.jpg'
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [10, 'Rating cannot be more than 10'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', MovieSchema);