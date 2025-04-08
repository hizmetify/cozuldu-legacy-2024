const jwt = require('jsonwebtoken');  
const { errorMessages } = require('../middlewares/errorMessageMiddleware');
const verify = (req,res,next) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.json({ message: errorMessages.ACCESS_DENIED });
    } 
    const token = cookies.split('; ').find(row => row.startsWith('token='));
    if (!token) {
        return res.json({ message: errorMessages.ACCESS_DENIED });
    } 
    const jwtToken = token.split('=')[1];
 
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;  
    next();
  } catch (error) {
    return res.send('Access Denied: No Token Provided');
    
  }
};


module.exports=verify