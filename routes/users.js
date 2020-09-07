const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
  userUpdateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');
const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');
const { getOne } = require('../controllers/handlerFactory');

router.param('id', (req, res, next, val) => {
  console.log('param id 1', val);
  next();
});
router.param('id', (req, res, next, val) => {
  console.log('param id 2', val);
  next();
});
// router.param('id', checkID);
router.route('/signup').post(signup);
router.route('/login').post(login);
//Reset forgotten password
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);
//Update Password
router.route('/updatePassword').patch(protect, updatePassword);
//Update Me User Data
router.route('/updateMe').patch(protect, restrictTo('admin'), userUpdateMe);
//Delete Me User
router.route('/deleteMe').patch(protect, deleteMe); //only update active:false

router.route('/me').get(protect, getMe, getUser);
router.route('/').get(getAllUsers).post(addUser);
router
  .route('/:id')
  .get(getUser)
  .patch(protect, restrictTo('admin'), updateUser)
  .delete(deleteUser);

module.exports = router;
