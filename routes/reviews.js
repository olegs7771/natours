const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const { addReview } = require('../controllers/reviewController');

router.route('/:id').post(protect, addReview);

module.exports = router;
