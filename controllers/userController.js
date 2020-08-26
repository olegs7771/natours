// const fs = require('fs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

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
};
