const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorMessages } = require('./errorMessageMiddleware');

const protect = async (req, res, next) => {
  let token = req.cookies.token;
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('No token found => 401');
    return res 
      .json({ message: errorMessages.ACCESS_DENIED});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.json({ message: errorMessages.USER_NOT_FOUND });
    }

    req.user = user._id;

    next();
  } catch (err) {
    res.json({ message: errorMessages.TOKEN_EXPIRED});
  }
};

module.exports = protect;
