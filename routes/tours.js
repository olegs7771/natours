const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
} = require('../controllers/tourController');

//Create Param Middleware
router.param('id', (req, res, next, val) => {
  console.log('got id', req.params.id);
  console.log('got id val', val);
  next();
});

//Mounting Router on the route

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').delete(deleteTour).get(getTour).patch(updateTour);

module.exports = router;
