const AppError = require('../utils/appError');

const handleObjectIdError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const sendErrorDev = (err, res) => {
  console.log('err', err);
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
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //Wrong string instead of /:id
    if (error.kind === 'ObjectId') error = handleObjectIdError(error);

    sendErrorProd(error, res);
  } else {
    console.log('test');
  }
};
