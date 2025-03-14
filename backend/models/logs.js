const mongoose = require('mongoose');
const autopopulate =require('mongoose-autopopulate')
mongoose.plugin(autopopulate);
const logsSchema = new mongoose.Schema({
    category:{
        type:String, 
    },
    text:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        autopopulate:true
    }
},{timestamps:true});

const Logs = mongoose.model('Logs', logsSchema);
module.exports = Logs;
