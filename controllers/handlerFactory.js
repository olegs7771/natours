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
module.exports = { deleteOne };
