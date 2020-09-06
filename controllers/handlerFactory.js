//This function returns controllers
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

module.exports = { deleteOne, updateOne, createOne };
