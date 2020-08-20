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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //Operational,trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other error: dodn't leak error details
  } else {
    //1) Log Error
    console.error('ERROR ❗️', err);
    //2) Send generic message

    res.status(500).json({
      status: 'Error',
      message: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log('err1', err.toString());
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('err in dev', err.message);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log('err in prod', err);
    let error = { ...err };
    // console.log('error ', error);

    //Wrong string instead of /:id
    if (error.kind === 'ObjectId') error = handleObjectIdError(error);
    if (error.code === 11000) error = handleDuplicateFieldsError(err.message);

    sendErrorProd(error, res);
  } else {
    console.log('test');
  }
};
