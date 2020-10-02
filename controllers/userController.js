const multer = require('multer');
const sharp = require('sharp');
const sizeOf = require('image-size');
const AppError = require('../utils/appError');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     //Create unique file name
//     const ext = file.mimetype.split('/')[1]; //'jpeg'
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  //Test if upoaded file is image
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image!', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const uploadUserPhoto = upload.single('photo');
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const dimensions = sizeOf(req.file.buffer);
  console.log('dimensions', dimensions);
  if (dimensions.orientation === 6) {
    //rotate clockwise 90deg
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500, {
        position: 'top',
      })
      .rotate(90)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  } else {
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  }
  next();
});

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
  console.log('req.file', req.file);
  //If User tries to update password ,thraw error
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cant update password here', 401));
  }
  //Filter Update Object. Prevent from updating :role,etc...
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
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
  uploadUserPhoto,
  resizeUserPhoto,
};
