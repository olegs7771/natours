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

//Create Param Middleware
router.param('id', (req, res, next, val) => {
  console.log('got id', req.params.id);
  console.log('got id val', val);
  next();
});

//Mounting Router on the route
//Create alias route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
//Get Stats Aggregation Pipeline
router.route('/stats').get(getToursStats);
//Bussiness problem function
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').delete(deleteTour).get(getTour).patch(updateTour);

module.exports = router;
