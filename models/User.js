const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The user name must have a name'],
    },
    email: {
      type: String,
      required: [true, 'User Email must have Email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email invalid format'],
    },
    photo: {
      type: String,
    },

    password: {
      type: String,
      required: [true, 'Please choose a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'No match',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
