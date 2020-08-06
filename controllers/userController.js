const fs = require('fs');
//Get  Users users.json Sync!
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

//Create Check ID middleware
const checkID = (req, res, next, val) => {
  const user = users.find((user) => user._id === val);
  if (!user)
    return res
      .status(400)
      .json({ result: 'error', message: 'User not found in check middleware' });

  next();
};

//Users
//Get All Users

const getAllUsers = (req, res) => {
  return res.status(200).json({
    result: 'success',
    users,
  });
};
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
const getUser = (req, res) => {
  console.log('getting user from handler');
  const user = users.find((user) => user._id === req.params.id);

  res.status(200).json({
    response: 'success',
    data: { user },
  });
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
  checkID,
};
