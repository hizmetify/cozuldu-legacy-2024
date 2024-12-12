const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const {
  registerSchema,
  loginSchema,
} = require('../validations/authValidation');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      password,
      phone,
      city,
      profilePic,
      portfolioLink,
    } = req.body;

    const { error } = registerSchema.validate({
      name,
      lastname,
      email,
      password,
      phone,
      city,
      profilePic,
      portfolioLink,
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
      profilePic,
      portfolioLink,
    });

    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(201).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
