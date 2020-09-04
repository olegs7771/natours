const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

//Add New Review
const addReview = catchAsync(async (req, res, next) => {
  //1) Check if Current User already left review for Current Tour
  console.log('req.user', req.user);
  console.log('req.body', req.body);
  console.log('req.params', req.params);
  const newReview = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.params.id,
    user: req.user.id,
  };
  console.log('newReview', newReview);
  const review = await Review.create(newReview).populate('user');

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});

//Get All Review
const getAllReviews = catchAsync(async (req, res, next) => {
  console.log('geeting all');
  const reviews = await Review.find();
  res.status(201).json({
    status: 'success',
    reviews: reviews.length,
    data: { reviews },
  });
});

module.exports = { addReview, getAllReviews };