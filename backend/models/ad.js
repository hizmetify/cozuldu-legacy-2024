const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceType: { type: String, required: true, enum: ['yüz yüze', 'dijital'] },
  city: {
    type: String,
    required: function () {
      return this.serviceType === 'yüz yüze';
    },
  },
  price: { type: Number, required: true },
  priceType: {
    type: String,
    required: true,
    enum: ['saatlik', 'günlük', 'iş başı'],
  },
  availability: [{ type: Date }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model('Ad', adSchema);
module.exports = { Ad };
