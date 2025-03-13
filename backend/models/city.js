const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    unique: true,
  },
});

const City = mongoose.models.City || mongoose.model('City', citySchema);

module.exports = City;
