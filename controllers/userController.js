const AppError = require('../utils/appError');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  console.log('obj', obj);
  console.log('allowedFields', allowedFields);
  const newObj = {};
  Object.keys(obj).map((elem) => {
    if (allowedFields.includes(elem)) newObj[elem] = obj[elem];
  });
  return newObj;
};

//To get user's own user we create middleware to pass user from req.user.id to req.user.params in order to use factory controller
const getMe = (req, res, next) => {
  console.log('req.user1', req.user);
  req.params.id = req.user.id;
  next();
};

//User Updates himsef
const userUpdateMe = catchAsync(async (req, res, next) => {
  console.log('req.body in update', req.body);
  //If User tries to update password ,thraw error
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cant update password here', 401));
  }
  //Filter Update Object. Prevent from updating :role,etc...
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log('filteredBody', filteredBody);
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.json({
    status: 'success',
    user,
  });
});

//Add User
const addUser = (req, res) => {
  res.status(200).json({
    result: 'user added',
  });
};
//Update User
//Don't Update Password with this!
const updateUser = factory.updateOne(User);
const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);
//User Deleted by Admin(completely)
const deleteUser = factory.deleteOne(User);

///Delete User by User(active:false)
const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  if (!user) {
    return next(new AppError('No User found', 404));
  }
  res.status(200).json({
    result: 'user active:false',
    data: { user },
  });
});

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
  userUpdateMe,
  deleteMe,
  getMe,
};
