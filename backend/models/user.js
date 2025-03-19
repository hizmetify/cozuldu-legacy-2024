const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    lastname: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
      trim: true,
    },
    isVerification: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    phone: {
      type: String,
      match: [/^\d{10,15}$/, 'Phone number must be 10-15 digits'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    profilePic: {
      type: String,
      default: null,
    },
    portfolioLink: {
      type: String,
      match: [/^https?:\/\/.+/, 'Portfolio link must be a valid URL'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
