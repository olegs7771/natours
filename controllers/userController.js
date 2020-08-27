const AppError = require('../utils/appError');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).map((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem];
  });
};

//Users
//Get All Users from local json file
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(201).json({
    status: 'success',
    results: users.length,
    users,
  });
});
//User Updates himsef
const userUpdateMe = catchAsync(async (req, res, next) => {
  //If User tries to update password ,thraw error
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cant update password here', 401));
  }
  //Filter Update Object. Prevent from updating :role,etc...
  const filteredBody = filterObj(req.body, 'name', 'email');
  const filterUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.json({
    status: 'success',
  });
});

//Add User
const addUser = (req, res) => {
  res.status(200).json({
    result: 'user added',
  });
};
//Update User
const updateUser = (req, res) => {
  res.status(200).json({
    result: 'user update',
  });
};
///Delete User
const deleteUser = (req, res) => {
  res.status(200).json({
    result: 'user deleted',
  });
};
const getUser = async (req, res) => {
  const user = await User.findById(req.body.id);
  res.status(200).json({
    response: 'success',
    user,
  });
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
  userUpdateMe,
};
