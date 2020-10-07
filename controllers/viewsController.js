const Tour = require('../models/Tour');
const User = require('../models/User');
const Booking = require('../models/Booking');
// const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  console.log('tours', tours);

  // 2) Build template

  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
    title: '| All Tours',
    tours,
  });
});
console.log('in views env', process.env.PASSWORD);
const getTour = catchAsync(async (req, res, next) => {
  console.log('in views env', process.env.PASSWORD);
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

//All bookings tours
const getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings of logged User

  const bookings = await Booking.find({ user: req.user.id });
  console.log('bookings', bookings);
  // 2) Find tours with the returned IDs
  const tourId = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourId } }); //find all tours with id $in array
  res.status(200).render('overview', {
    title: 'Bookings',
    tours,
  });
});

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
  getMyTours,
};
