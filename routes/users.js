const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
  checkID,
} = require('../controllers/userController');

router.param('id', (req, res, next, val) => {
  console.log('param id 1', val);
  next();
});
router.param('id', (req, res, next, val) => {
  console.log('param id 2', val);
  next();
});
router.param('id', checkID);

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
