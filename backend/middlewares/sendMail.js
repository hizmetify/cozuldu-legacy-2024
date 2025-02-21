const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendMail = (toMail, privateCode) => {
  let htmlTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hesap Doğrulama Kodu</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f8f8;
          margin: 0;
          padding: 0;
          color: #333;
        }
    
        .email-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background-color: #ffffff;
          border-radius: 15px;
          box-shadow: 0 12px 50px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeIn 1s ease-out;
        }
    
        .email-header {
          font-size: 32px;
          font-weight: 600;
          color: #2C3E50;
          text-transform: uppercase;
          margin-bottom: 25px;
          letter-spacing: 2px;
          animation: slideIn 1s ease-in-out;
        }
    
        .cta-button {
          display: inline-block;
          margin-top: 30px;
          background-color: #2980b9;
          color: white;
          padding: 18px 35px;
          text-decoration: none;
          font-size: 18px;
          font-weight: 600;
          border-radius: 50px;
          transition: transform 0.3s ease, background-color 0.3s ease;
          animation: zoomIn 1s ease-in-out;
        }
    
        .cta-button:hover {
          background-color: #1abc9c;
          transform: scale(1.05);
        }
    
        .code-box {
          background-color: #34495e;
          color: #fff;
          font-size: 36px;
          font-weight: 700;
          padding: 20px;
          border-radius: 12px;
          margin: 30px 0;
          display: inline-block;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          animation: slideInCode 1s ease-out;
        }
    
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #7f8c8d;
          text-align: center;
          animation: fadeInFooter 1.5s ease-in-out;
        }
    
        .footer a {
          color: #2980b9;
          text-decoration: none;
        }
    
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
    
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
    
        @keyframes zoomIn {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
    
        @keyframes slideInCode {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
    
        @keyframes fadeInFooter {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1 class="email-header">Hesap Doğrulama</h1>
        <p>Merhaba,</p>
        <p>Hesabınızı doğrulamak için aşağıdaki doğrulama kodunu kullanın:</p>
        <div class="code-box">${privateCode}</div>
        <p>Doğrulama işlemini tamamlamak için bu kodu girin.</p>
        <a href="http://localhost:5173/emailverify" class="cta-button">Hesabımı Doğrula</a>
        <div class="footer">
          <p>Bu e-posta yalnızca hesap doğrulama amacıyla gönderilmiştir. Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
          <p>Bize her zaman <a href="mailto:support@yourcompany.com">destek@company.com</a> adresinden ulaşabilirsiniz.</p>
        </div>
      </div>
    </body>
    </html>
    
    `;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Kendi mail adresin
      pass: process.env.EMAIL_CODE, // Google'dan aldığın Uygulama Şifresi
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: toMail,
    subject: 'Hesap Doğrulama',
    html: `<html>...${htmlTemplate}...</html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('E-posta gönderildi: ' + info.response);
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

let pageOpenTime = Date.now(); // Sayfa açılma zamanı (milisaniye cinsinden)
let isTimerActive = true;
let code = '';
const sendEmail = async (req, res) => {
  code = generateRandomCode();

  pageOpenTime = Date.now(); // Sayfa açılma zamanı (milisaniye cinsinden)
  token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Yetkisiz erişim! Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    if (user.isVerification == false) {
      sendMail(user?.email, code);
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

    let inputCode = req.body.code;
    if (inputCode == code) {
      const user = await User.findOneAndUpdate(
        { email: userVerify?.email },
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
