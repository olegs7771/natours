const express = require('express');

const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const { getCheckOutSession } = require('../controllers/bookingController');

router.route('/checkout-session/:tourId').get(protect, getCheckOutSession);

module.exports = router;
