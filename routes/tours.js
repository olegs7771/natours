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
  getToursWithin,
  getDistances,
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

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);

//find tour location near me
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
//old way==> /tours-distance?distance=233&center/=-40,45&unit=mi
//our way==>/tours-distance/233/center/34.105202, -118.097279/unit/mi

//Find distances to all tours
router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), addNewTour);

router
  .route('/:id')
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour);

module.exports = router;
