const AppError = require('../utils/appError');

const handleObjectIdError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};
const handleDuplicateFieldsError = (errMsg) => {
  const reg = errMsg.match(/"(.*?)"/g)[0];
  console.log('reg', reg);
  const message = `Duplicate field value:${reg}. Please use another value!`;
  return new AppError(message, 404);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((elem) => elem.message);
  console.log('errors', errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
};
const handleJWTError = () =>
  new AppError('Invalid Token Please log again', 401);
const handleJWTErrorExp = () =>
  new AppError('Your token is expired. Please log again', 401);

//DEV ERROR
const sendErrorDev = (err, req, res) => {
  console.log('req.originalUrl', req.originalUrl);
  //API ERROR
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //View Error
    res.render('error', {
      title: 'Error',
      msg: err.message,
    });
    // res.json({
    //   status: 'success',
    // });
  }
};
//PROD ERROR
const sendErrorProd = (err, res) => {
  //Operational,trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other error: dodn't leak error details
  } else {
    console.log('Error 💥', err);
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong..',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log('err in prod', err);
    let error = { ...err };
    // console.log('error.name', error.errors.name.name);
    //Wrong string instead of /:id
    if (error.kind === 'ObjectId') error = handleObjectIdError(error);
    //Dublicate name on unique
    if (error.code === 11000) error = handleDuplicateFieldsError(err.message);
    //Validation in Schema fields
    if (error._message === 'Validation failed')
      error = handleValidationError(error);
    console.log('error', error);
    if (error.name === 'TokenExpiredError') error = handleJWTErrorExp();
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    sendErrorProd(error, req, res);
  }
};
