const fs = require('fs');
//Get  Users users.json Sync!
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

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
  const user = users.find((user) => user._id === req.params.id);
  if (!user)
    return res.status(400).json({ result: 'error', message: 'User not found' });
  res.status(200).json({
    response: 'success',
    data: { user },
  });
};

module.exports = { getAllUsers, addUser, updateUser, deleteUser, getUser };
