const Theater = require('../models/Theater');

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
exports.getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().sort('name');
    
    res.status(200).json({
      success: true,
      count: theaters.length,
      data: theaters
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single theater
// @route   GET /api/theaters/:id
// @access  Public
exports.getTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.status(200).json({
      success: true,
      data: theater
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new theater
// @route   POST /api/theaters
// @access  Private (Admin only)
exports.createTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    
    res.status(201).json({
      success: true,
      data: theater
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update theater
// @route   PUT /api/theaters/:id
// @access  Private (Admin only)
exports.updateTheater = async (req, res) => {
  try {
    let theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: theater
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete theater
// @route   DELETE /api/theaters/:id
// @access  Private (Admin only)
exports.deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    await theater.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};