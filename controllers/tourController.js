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
    //Build Query
    //1)Filtering
    const queryObj = { ...req.query };
    const exludeFields = ['page', 'sort', 'limit', 'fields'];
    //Remove those keys from req.query
    exludeFields.forEach((elem) => delete queryObj[elem]);
    //2) Advanced Filtering
    console.log('queryObj', queryObj);
    let queryStr = JSON.stringify(queryObj);
    //if in query string :gt,gte,lte,lt
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);
    console.log('queryStr', JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    //3)Impliment query sorting
    const sortBy = req.query.sort;
    console.log('req.query.sort', req.query.sort);
    if (req.query.sort) {
      console.log('req.query.sort :', req.query.sort);
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log('sortBy :', sortBy);

      query = query.sort(sortBy);
    } else {
      //sort bu date created
      query.sort('-createdAt');
    }
    // //3) Field limiting
    console.log('req.query.fields', req.query.fields);
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // console.log('fields :', fields);
      query = query.select(fields);
    } else {
      // with - we exclude keys from query
      query = query.select('-__v');
    }
    //4) Pagination (limited quantity of responses per page)
    //page=2&limit=10 1-10,page1,11-20,page2,21-30 page 3
    console.log('req.query', req.query);
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    console.log('page', page);
    if (req.query.page) {
      //count all documents
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) {
        return res.json({ message: 'Page not exists' });
      }
      const skipPage = (page - 1) * limit;
      console.log('skipPage', skipPage);
      query = query.skip(skipPage).limit(limit * 1);
    } else {
      query = query.skip().limit(limit * 1);
    }

    //Execute Query
    const tours = await query;
    // console.log('req.query', req.query);
    // const tours = await Tour.find()
    //   .where('duration')
    //   .lt(10)
    //   .where('difficulty')
    //   .equals('medium');

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
  aliasTopTours,
};
