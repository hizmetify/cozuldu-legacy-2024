const mongoose = require('mongoose'); 
const autopopulate =require('mongoose-autopopulate')
mongoose.plugin(autopopulate);
const favoriSchema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        autopopulate :true,
        required:true
    },
    adId:{
        type:mongoose.Types.ObjectId,
        ref:'Ad',
        autopopulate:true,
        required:true
    }, 
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
); 
const Favori = mongoose.model('Favori', favoriSchema);
module.exports = Favori;
