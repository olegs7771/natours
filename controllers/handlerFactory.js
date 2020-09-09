//This function returns controllers
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document fount for this id', 404));
    }

    res.status(200).json({
      result: 'success',
      message: `document was successfully deleted`,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('req.body', req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found', 404));
    }
    res.status(201).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('req.body', req.body);
    const doc = await Model.create(req.body);
    res.status(201).json({
      result: 'Success',
      data: {
        tour: doc,
      },
    });
  });

const getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    console.log('req.params', req.params);
    const doc = await query;
    if (!doc) {
      return next(new AppError('Wrong doc Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //Allow nested routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    console.log('req.query1', req.query);
    //Execute Query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;
    // const docs = await features.query.explain();

    //Send Response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
