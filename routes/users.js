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
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

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
router.route('/logout').get(logout);
//Reset forgotten password
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

//All middleware work in siquence . This router is mini app, so
// we can put:
router.use(protect);
//Than all routers from here will be with protect
// router.route('/updatePassword').patch(protect, updatePassword);

//
//Update Password
router.route('/updatePassword').patch(updatePassword);
//Update Me User Data
router.route('/updateMe').patch(protect, userUpdateMe);
//Delete Me User
router.route('/deleteMe').patch(deleteMe); //only update active:false

router.route('/me').get(getMe, getUser);
//Those routers only for admin
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
