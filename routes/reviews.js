const express = require('express');

const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const {
  addReview,
  getAllReviews,
  deleteReview,
  updateReview,
  TourUserId,
  getReview,
} = require('../controllers/reviewController');

router.use(protect);
router
  .route('/')
  .post(restrictTo('user'), TourUserId, addReview)
  .get(getAllReviews);

router
  .route('/:id')
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .get(getReview);
module.exports = router;
