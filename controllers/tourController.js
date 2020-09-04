// const fs = require('fs');
const Tour = require('../models/Tour');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
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
const getAllTours = catchAsync(async (req, res, next) => {
  console.log('req.query', req.query);
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
});
//Get Tour
const getTour = catchAsync(async (req, res, next) => {
  console.log('req.params', req.params);
  const tour = await Tour.findById(req.params.id);
  console.log('tour', tour);
  if (!tour) {
    return next(new AppError('Wrong Tour Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//Add New Tour

const addNewTour = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    result: 'Success',
    data: {
      tour: newTour,
    },
  });
});
//Update File Data
const updateTour = catchAsync(async (req, res, next) => {
  console.log('req.query', req.query);
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.query, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('Wrong Tour Id', 404));
  }
  res.status(201).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});
//Delete File Data
const deleteTour = catchAsync(async (req, res, next) => {
  console.log('req.params', req.params);
  const tour = await Tour.findByIdAndDelete(req.params.id, {
    select: 'name',
  });
  if (!tour) {
    return next(new AppError('Wrong Tour Id', 404));
  }
  console.log('tour', tour);
  res.status(200).json({
    result: 'success',
    message: `${tour.name} was successfully deleted`,
  });
});

//Aggregate data
const getToursStats = catchAsync(async (req, res, next) => {
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
});

//Create Function for calculating bussiness problem

const getMonthlyPlan = catchAsync(async (req, res, next) => {
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
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.json({
    status: 'Success',
    results: plan.length,
    plan,
  });
});

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
