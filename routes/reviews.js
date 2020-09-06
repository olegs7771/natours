const express = require('express');

const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const {
  addReview,
  getAllReviews,
  deleteReview,
  updateReview,
  TourUserId,
} = require('../controllers/reviewController');

router
  .route('/')
  .post(protect, restrictTo('user'), TourUserId, addReview)
  .get(protect, getAllReviews);
router.route('/:id').patch(updateReview).delete(deleteReview);
module.exports = router;
