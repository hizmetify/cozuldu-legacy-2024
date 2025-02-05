const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  // Burada log ekliyoruz:
  console.log('--- PROTECT MIDDLEWARE ---');
  console.log('req.cookies =>', req.cookies);
  console.log('req.headers.authorization =>', req.headers.authorization);

  let token = req.cookies.token;
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Final token =>', token);

  if (!token) {
    console.log('No token found => 401');
    return res
      .status(401)
      .json({ message: 'Yetkisiz erişim! Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded =>', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found => 404');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    req.user = user;
    console.log('User found =>', user._id);
    next();
  } catch (err) {
    console.error('Token doğrulama hatası:', err.message);
    res.status(401).json({ message: 'Geçersiz token!' });
  }
};

module.exports = protect;
