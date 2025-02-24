const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const getEmailTemplate = require('../utils/mailUI');

const sendMail = (toMail, privateCode) => {
  const htmlTemplate = getEmailTemplate(privateCode);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_CODE,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toMail,
    subject: 'Hesap Doğrulama',
    html: htmlTemplate,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('E-posta gönderme hatası:', error);
    } else {
      console.log('E-posta başarıyla gönderildi:', info.response);
    }
  });
  return;
};
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

let pageOpenTime = Date.now();
let isTimerActive = true;
let code = '';
let token = '';
const sendEmail = async (req, res) => {
  code = generateRandomCode();
  pageOpenTime = Date.now();
  token = req.cookies.token;

  if (!token) {
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
    if (!user.isVerification) {
      sendMail(user.email, code);
      return res.json({ status: 'success' });
    }

    return res.json({ status: 'continue' });
  } catch (err) {
    res.status(401).json({ message: 'Geçersiz token!' });
  }
};

const EmailVerify = async (req, res) => {
  try {
    const currentTime = Date.now();
    const elapsedTime = currentTime - pageOpenTime;
    let timeLeft = Math.max(180000 - elapsedTime, 0);

    if (timeLeft === 0 && isTimerActive) {
      isTimerActive = false;
      code = '';
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userVerify = await User.findById(decoded.id).select('-password');

    if (!userVerify) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    const inputCode = req.body.code;
    if (inputCode === code) {
      await User.findOneAndUpdate(
        { email: userVerify.email },
        { isVerification: true },
        { new: true }
      );
      return res.json({ status: 'success' });
    } else {
      return res.json({ status: false });
    }
  } catch (err) {
    res.status(401).json({ message: 'Geçersiz token!' });
  }
};

module.exports = { sendEmail, EmailVerify };
