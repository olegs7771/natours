const AppError = require('../utils/appError');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).map((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem];
  });
  return newObj;
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
  console.log('filteredBody', filteredBody);
  const filterUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.json({
    status: 'success',
    filterUser,
  });
});

//User Deletes himself
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }, { new: true });
  res.status(204).json({
    status: 'success',
    data: null,
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
  console.log('req.params', req.params);
  const user = await User.findById(req.params.id);
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
  deleteMe,
};
