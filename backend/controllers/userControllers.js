const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const decodedId = async (req) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

const emailUpdate = async (req, res) => {
  let user = await userId(req);
  let { email } = req.body;
  let response = await User.findByIdAndUpdate(
    user?._id,
    { $set: { email } },
    { new: true }
  );
  if (!response) {
    return res.status(404).json({ message: 'Mail Güncellenmedi' });
  }
  return res.status(200).json({ message: 'Mail güncellendi' });
};
const nameInfoUpdate = async (req, res) => {
  let user = await userId(req);
  let { name, lastname } = req.body;
  let response = await User.findByIdAndUpdate(
    user?._id,
    { $set: { name, lastname } },
    { new: true }
  );
  if (!response) {
    return res.status(404).json({ message: 'Ad soyad güncellenmedi' });
  }
  return res.status(200).json({ message: 'Ad soyad güncellendi' });
};

const deleteAccount = async (req, res) => {
  let { password } = req.body;
  let decoded = await decodedId(req);
  const user = await User.findById(decoded).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
  }
  const isMatch = await bcrypt.compare(password, user?.password);
  if (isMatch) {
    let response = await User.findByIdAndDelete(user?._id);
    if (!response)
      return res
        .status(404)
        .json({ message: 'Hesap silinemedi daha sonra tekrar deneyiniz...' });
    return res.status(200).json({ message: 'Hesap silindi.' });
  } else {
    return res.status(401).json({ message: 'Şifre doğru değil.' });
  }
};

module.exports = {
  emailUpdate,
  nameInfoUpdate,
  deleteAccount,
};
