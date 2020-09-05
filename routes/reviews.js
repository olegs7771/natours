const express = require('express');

const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const { addReview, getAllReviews } = require('../controllers/reviewController');

router
  .route('/')
  .post(protect, restrictTo('user'), addReview)
  .get(protect, getAllReviews);
module.exports = router;
