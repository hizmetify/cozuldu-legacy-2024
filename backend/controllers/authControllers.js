const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const {
  registerSchema,
  loginSchema,
} = require('../validations/authValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorMessages } = require('../middlewares/errorMessageMiddleware');

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
      return res.json({ error: errorMessages.MISSING_FIELDS });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.json({ error: errorMessages.EMAIL_ALREADY_EXISTS});
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

    res.json({
      error:
       errorMessages.SERVER_ERROR,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return res.json({ error: errorMessages.MISSING_FIELDS });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: errorMessages.USER_NOT_FOUND });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: errorMessages.INVALID_CREDENTIALS });
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
    res.json({ error: errorMessages.LOGIN_FAILED });
  }
};

const me = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ message: errorMessages.ACCESS_DENIED });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.json({ error: errorMessages.SERVER_ERROR });
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
