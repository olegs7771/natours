// const fs = require('fs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
//Get  Users users.json Sync!
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

//Create Check ID middleware
// const checkID = (req, res, next, val) => {
//   const user = users.find((user) => user._id === val);
//   if (!user)
//     return res
//       .status(400)
//       .json({ result: 'error', message: 'User not found in check middleware' });

//   next();
// };

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
//Delete User
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
  // checkID,
};
