const express = require('express');

const router = express.Router();
const {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
//Merge Rauters
const reviewRauter = require('./reviews');

//Reroute from tour route to review route
router.use('/:tourId/reviews', reviewRauter);

//Mounting Router on the route
//Create alias route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
//Get Stats Aggregation Pipeline
router.route('/stats').get(getToursStats);
//Bussiness problem function
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(addNewTour);

router
  .route('/:id')
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
  .get(getTour)
  .patch(updateTour);

module.exports = router;
