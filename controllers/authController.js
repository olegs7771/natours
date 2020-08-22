const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signup = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  res.status(201).json({
    status: 'success',
    token,
    data: newUser,
  });
});

const login = (req, res, next) => {
  const { email, password } = req.body;
};

module.exports = { signup, login };
