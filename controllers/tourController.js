const fs = require('fs');
const Tour = require('../models/Tour');
//Get Tours Sync!
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Create check for id middleware

//Ceck for Post (AddTour)
const checkNewTour = (req, res, next) => {
  console.log('req.body middleware post', req.body);
  if (!req.body.name) {
    return res.status(400).json({
      result: 'Error',
      message: 'Name can not be empty',
    });
  }
  next();
};

//Get All Tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',

    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};
//Get Tour
const getTour = (req, res) => {
  console.log('req.params', req.params);
  // const tour = tours.find((elem) => elem.id === req.params.id * 1);

  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',

    // data: {
    //   tour,
    // },
  });
};
//Add New Tour
const addNewTour = async (req, res) => {
  try {
    console.log('req.body', req.body);
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      result: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: err,
    });
  }
};
//Update File Data
const updateTour = (req, res) => {
  console.log('req', req);
  res.status(200).json({
    result: 'success',
    tour: 'Updated',
  });
};
//Delete File Data
const deleteTour = (req, res) => {
  res.status(200).json({
    result: 'success',
    tour: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  checkNewTour,
};
