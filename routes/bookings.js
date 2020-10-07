const express = require('express');

const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require('../controllers/authController');
const {
  getCheckOutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');

router.use(protect); //all routs pass auth handler
router.route('/checkout-session/:tourId').get(protect, getCheckOutSession);

router.use(restrictTo('admin', 'lead-guide')); //all routes only for admin or leas-guide
router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
