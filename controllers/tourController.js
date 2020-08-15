// const fs = require('fs');
const Tour = require('../models/Tour');
const APIFeatures = require('../utils/apiFeatures');
// Get Tours Sync!
// const toursJson = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Create Controller for Alias Route
//Prefill req.query object with presetted params
//Before in goes to getAllTours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Get All Tours
const getAllTours = async (req, res) => {
  console.log('req.query', req.query);
  try {
    //Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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

//Aggregate data
const getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {
            $gte: 4.5,
          },
        },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.json({
      status: 'Success',
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: 'Can not find the document',
    });
  }
};

//Create Function for calculating bussiness problem

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
    ]);
    res.json({
      status: 'Success',
      plan,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: "can't get montly plan",
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
};
