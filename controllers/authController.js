const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
    role: req.body.role,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
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
  console.log('req.params in protect', req.params);
  let token;
  //1) Get Token and check if it's valid
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }
  //2) Varification Token
  // jwt.verify(token, process.env.JWT_SECRET, (cb, decoded) => {
  //   console.log('cb', cb);
  //   console.log('decoded', decoded);
  // });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded', decoded);

  //3) Check if user still exists
  const user = await User.findById(decoded.id);
  console.log('user', user);

  if (!user) {
    return next(new AppError('The user of this token no longer exists', 401));
  }

  //4) Check if user changed password after token was issued
  if (user.passwordChanged(decoded.iat)) {
    //if true then passwordChangedAt > decoded.iat cut pipeline
    return next(
      new AppError(
        'The user has changed password recently. Please log in again',
        401
      )
    );
  }
  console.log('route protection grants pass');
  //store found user in pipiline in req object
  req.user = user;
  next();
});

//Restrict Users from delete tours only admin or lead-guide permmited
const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('req.params in restrict', req.params);
    console.log('roles', roles);
    console.log('req.user', req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to delete tours", 403)
      );
    }
    next();
  };
};

//Password Recovery
const forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no user found associated with this email', 404)
    );
  }
  //2) Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3)Send it to user's Email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit A Patch request with your new password and passwordConfirm to:${resetURL}.\nIf you didn't forget your password ,please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    //Error to sent email. Delete both passwordResetToken and passwordResetExpires from DB
    console.log('err!!', err.name, err.message);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(`There was an error sendind email:${err.message}`, 500)
    );
  }
});
const resetPassword = (req, res, next) => {};

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
