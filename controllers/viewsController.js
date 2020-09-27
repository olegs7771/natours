const Tour = require('../models/Tour');
const User = require('../models/User');
// const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
    title: '| All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // 1)get the data for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    field: 'review',
  });

  // 2) Build template
  // 3) Render template using data from 1
  res.status(200).render('tour', {
    title: `| ${tour.name} Tour`,
    tour,
  });
});

const getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

const getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};
const updateUserData = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );
  // res.status(200).render('account', {
  //   title: 'Your Account',
  // });
  res.json({ status: 'success' });
});

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
};
