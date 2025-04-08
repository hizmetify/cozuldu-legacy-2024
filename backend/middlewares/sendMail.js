const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const getEmailTemplate = require('../utils/mailUI');
const { errorMessages } = require('./errorMessageMiddleware');

const userVerificationData = new Map();

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

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('E-posta gönderme hatası:', error);
        reject(error);
      } else {
        console.log('E-posta başarıyla gönderildi:', info.response);
        resolve(info);
      }
    });
  });
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

const sendEmail = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res 
      .json({ message: errorMessages.ACCESS_DENIED });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.json({ message: errorMessages.USER_NOT_FOUND});
    }

    if (!user.isVerification) {
      const code = generateRandomCode();

      userVerificationData.set(user._id.toString(), {
        code,
        pageOpenTime: Date.now(),
        isTimerActive: true,
        resendAttempts: 0,
        lastResendTime: Date.now(),
      });

      await sendMail(user.email, code);
      return res.json({ status: 'success' });
    }

    return res.json({ status: 'continue' });
  } catch (err) {
    console.error('Send email error:', err);
    res.json({ message: errorMessages.TOKEN_EXPIRED });
  }
};

const EmailVerify = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ message: errorMessages.ACCESS_DENIED });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const userVerify = await User.findById(userId).select('-password');

    if (!userVerify) {
      return res.json({ message: errorMessages.USER_NOT_FOUND});
    }

    const userData = userVerificationData.get(userId);
    if (!userData) {
      return res.status(400).json({
        status: 'error',
        message: 'Doğrulama kodu bulunamadı. Lütfen yeni kod talep edin.',
      });
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - userData.pageOpenTime;
    const timeLeft = Math.max(180000 - elapsedTime, 0);

    if (timeLeft === 0 && userData.isTimerActive) {
      userData.isTimerActive = false;
      userData.code = '';
      return res.status(400).json({
        status: 'error',
        message: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod talep edin.',
      });
    }

    const inputCode = req.body.code;
    if (inputCode === userData.code) {
      await User.findOneAndUpdate(
        { email: userVerify.email },
        { isVerification: true },
        { new: true }
      );
      userVerificationData.delete(userId);
      return res.json({ status: 'success' });
    } else {
      return res.json({
        status: 'error',
        message: 'Geçersiz doğrulama kodu.',
      });
    }
  } catch (err) {
    console.error('Email verify error:', err);
    res.json({ message: errorMessages.TOKEN_EXPIRED });
  }
};
const resendVerificationCode = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ message: errorMessages.ACCESS_DENIED});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.json({ message: errorMessages.USER_NOT_FOUND });
    }

    let userData = userVerificationData.get(userId);
    if (!userData) {
      userData = {
        code: '',
        pageOpenTime: Date.now(),
        isTimerActive: true,
        resendAttempts: 0,
        lastResendTime: Date.now(),
      };
    }
    const currentTime = Date.now();
    if (userData.resendAttempts >= 3) {
      return res.status(429).json({
        status: 'error',
        message: 'Çok fazla kod talebi. Lütfen daha sonra tekrar deneyin.',
      });
    }

    if (currentTime - userData.lastResendTime < 60000) {
      return res.status(429).json({
        status: 'error',
        message: 'Lütfen yeni kod talep etmeden önce biraz bekleyin.',
      });
    }

    const newCode = generateRandomCode();
    userData.code = newCode;
    userData.pageOpenTime = currentTime;
    userData.isTimerActive = true;
    userData.resendAttempts += 1;
    userData.lastResendTime = currentTime;

    userVerificationData.set(userId, userData);

    await sendMail(user.email, newCode);

    return res.json({
      status: 'success',
      message: 'Yeni doğrulama kodu gönderildi.',
    });
  } catch (err) {
    console.error('Resend verification code error:', err);
    res.json({ message: errorMessages.INVALID_TOKEN});
  }
};

module.exports = { sendEmail, EmailVerify, resendVerificationCode };
