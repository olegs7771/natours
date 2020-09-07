const Review = require('../models/Review');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');

//Add New Review

const TourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = factory.getAll(Review);
const addReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);
const getReview = factory.getOne(Review);

module.exports = {
  TourUserId,
  addReview,
  getAllReviews,
  deleteReview,
  updateReview,
  getReview,
};
