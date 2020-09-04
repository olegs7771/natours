const express = require('express');

const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const { addReview, getAllReviews } = require('../controllers/reviewController');

router.route('/:id').post(protect, restrictTo('user'), addReview);
router.route('/').get(protect, getAllReviews);
module.exports = router;
