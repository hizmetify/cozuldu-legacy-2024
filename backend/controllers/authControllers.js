const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const {
  registerSchema,
  loginSchema,
} = require('../validations/authValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      password,
      phone,
      city,
    } = req.body;

    const { error } = registerSchema.validate({
      name,
      lastname,
      email,
      password,
      phone,
      city,
    });

    if (error) {
      return res.status(401).json({ error: error.details[0].message });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone,
      city,
    });

    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id);

    const userData = {
      _id: savedUser._id,
      name: savedUser.name,
      lastname: savedUser.lastname,
      email: savedUser.email,
      isVerified: savedUser.isVerification,
      phone: savedUser.phone,
      city: savedUser.city,
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ message: 'Başarıyla kayıt oldunuz.', token, user: userData });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:
        'Kayıt olurken sunucuda bir hata oluştu lütfen daha sonra tekrar deneyiniz.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Şifre hatalı.' });
    }

    const token = generateToken(user._id);

    const userData = {
      isVerified: user.isVerification,
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ message: 'Başarıyla giriş yapıldı.', token, user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Giriş yapılırken bir hata oluştu.' });
  }
};

const me = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu' });
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Başarı ile çıkış yaptınız' });
};

module.exports = { register, login, logout, me };
