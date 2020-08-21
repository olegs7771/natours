const mongoose = require('mongoose');

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
    },
    photo: {
      type: String,
    },

    password: {
      type: String,
      required: [true, 'Please choose password'],
    },
    passwordConfirm: {
      type: Boolean,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
