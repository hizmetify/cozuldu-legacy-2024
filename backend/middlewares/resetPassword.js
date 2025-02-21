const nodemailer = require('nodemailer');
const User = require('../models/user');
 
const PasswordSend=async (req,res)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,  
          pass: process.env.EMAIL_CODE,   
        },
      });
      const { email } = req.body;
      const user = await User.findOne({email:email}).select('-password'); 
      
      if(!user?.isVerification)
        return res.json({message:'E-Mail doğrulanmadığı için güncelleme işlemi yapılamıyor. Sorununuzu çözmek için lütfen müşteri hizmetleri ile iletişime geçiniz.',status:false})
      const resetPasswordUrl = `http://localhost:5173/resetPassword/${user?.email}`;
    
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Parola Sıfırlama Talebi',
        html: `
          <h1>Parolanızı Sıfırlayın</h1>
          <p>Parolanızı sıfırlamak için aşağıdaki linke tıklayın:</p>
          <a href="${resetPasswordUrl}">Parolayı Sıfırlamak İçin Tıklayın</a>
          <p>Eğer bu isteği siz atmadıysanız lütfen dikkate almayın.</p>
        `,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        emailVerify=user?.email
        res.status(200).json({ message: 'Mail gönderildi.' });
      } catch (error) {
        res.status(500).json({ message: 'Mail gönderilemedi', error });
      }
} 

const bcrypt = require('bcryptjs');
const PasswordChange=async(req,res)=>{
    try { 
        let { email,password } = req.body; 
        const user = await User.findOne({ email: email }); 
        if (!user) {
            return res.json({ message: "Kullanıcı bulunamadı!", status: false });
        } 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
     
        await user.save();
    
        return res.json({ message: "Güncelleme işlemi başarılı", status: true });
    
    } catch (error) {
        return res.json({ message: error.message, status: false });
    }
    
    
}

module.exports={
    PasswordSend,
    PasswordChange
}