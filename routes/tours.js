const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  aliasTopTours,
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

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').delete(deleteTour).get(getTour).patch(updateTour);

module.exports = router;
