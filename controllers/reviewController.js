const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

//Add New Review
const addReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  //1) Check if Current User already left review for Current Tour

  // console.log('req.body.tour', req.body.tour);
  // console.log('req.body.user', req.body.user);
  // console.log('req.params', req.params);
  const newReview = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  };
  // console.log('newReview', newReview);
  const review = await Review.create(newReview);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

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

module.exports = { addReview, getAllReviews };
