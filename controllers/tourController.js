const fs = require('fs');
const Tour = require('../models/Tour');
// Get Tours Sync!
// const toursJson = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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
const getAllTours = async (req, res) => {
  try {
    //Build Query
    console.log('req.query', req.query);
    // const tours = await Tour.find()
    //   .where('duration')
    //   .lt(10)
    //   .where('difficulty')
    //   .equals('medium');
    const queryObj = { ...req.query };
    const exludeFields = ['page', 'sort', 'limit', 'fields'];
    exludeFields.forEach((elem) => delete queryObj[elem]);

    console.log('req.query', req.query);
    console.log('queryObj', queryObj);
    const query = Tour.find(queryObj);
    //Impliment query sorting / filter

    //Execute Query
    const tours = await query;

    //Send Response
    res.status(200).json({
      status: 'success',

      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: err,
    });
  }
};
//Get Tour
const getTour = async (req, res) => {
  try {
    console.log('req.params', req.params);
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      response: 'Error',
      message: err,
    });
  }
};

//Add New Tour
const addNewTour = async (req, res) => {
  console.log('toursJson', toursJson.length);
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
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      result: 'Error',
      message: err,
    });
  }
};
//Delete File Data
const deleteTour = async (req, res) => {
  console.log('req.params', req.params);
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id, {
      select: 'name',
    });
    console.log('tour', tour);
    res.status(200).json({
      result: 'success',
      message: `${tour.name} was successfully deleted`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: 'Can not find the document',
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  checkNewTour,
};
