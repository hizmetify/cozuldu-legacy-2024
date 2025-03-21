const { default: mongoose } = require("mongoose"); 
const AdminSchema = new mongoose.Schema({ 
    email:{
        type:String,
        required:true,
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
   
    },
    password:{
        type:String,
        required:true,
        minlength: [6, 'Password must be at least 6 characters long'], 
    }, 

  },{timestamps:true});
const Admin = mongoose.model('Admin', AdminSchema);
module.exports={Admin}