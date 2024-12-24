const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res
      .status(401)
      .json({ message: 'Yetkisiz erişim! Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Token doğrulama hatası:', err.message);
    res.status(401).json({ message: 'Geçersiz token!' });
  }
};

module.exports = protect;
