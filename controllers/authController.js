const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

const signup = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)Check if Email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide Email and Password', 400));
  }
  //2)Check If User exists&& password is correct
  const user = await User.findOne({ email }).select('+password');
  if (
    !user ||
    !(await user.correctPassword(password.toString(), user.password))
  )
    return next(new AppError('Invalid Email or Password', 401));
  //3)If everything ok,send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
});

//Protect Routes Middleware
const protect = catchAsync(async (req, res, next) => {
  console.log('route protection');
  next();
});

module.exports = { signup, login, protect };
