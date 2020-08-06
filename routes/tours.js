const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  checkID,
  checkNewTour,
} = require('../controllers/tourController');

//Create Param Middleware
router.param('id', (req, res, next, val) => {
  console.log('got id', req.params.id);
  console.log('got id val', val);
  next();
});

//Testing Id middleware
router.param('id', checkID);

//Mounting Router on the route

router.route('/').get(getAllTours).post(checkNewTour, addNewTour);
router.route('/:id').delete(deleteTour).get(getTour).patch(updateTour);

module.exports = router;
