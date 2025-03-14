const mongoose = require('mongoose');
const autopopulate =require('mongoose-autopopulate')
mongoose.plugin(autopopulate);
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceType: { type: String, required: true, enum: ['yüz yüze'] },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true ,
    autopopulate:true
  },
  subCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubCategory', 
    required: true ,
    autopopulate:true
  },
  city: {
    type: String,
    required: true,
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
  viewing:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;