const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');

//Add New Review

const TourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
const addReview = factory.createOne(Review);
// const addReview = catchAsync(async (req, res, next) => {
//   //Allow nested routes
//   // if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id;

//   const review = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: { review },
//   });
// });

//Get All Review
const getAllReviews = catchAsync(async (req, res, next) => {
  //Allow nested routes
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  console.log('geeting all');
  const reviews = await Review.find(filter);
  res.status(201).json({
    status: 'success',
    reviews: reviews.length,
    data: { reviews },
  });
});

const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = {
  TourUserId,
  addReview,
  getAllReviews,
  deleteReview,
  updateReview,
};
