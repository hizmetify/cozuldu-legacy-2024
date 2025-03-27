const mongoose = require('mongoose');

const SSSSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: {
    type: String, required:true
  },
});

const SSS = mongoose.model('SSS', SSSSchema);
module.exports = SSS;
