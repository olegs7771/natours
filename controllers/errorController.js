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
const handleValidationError = (errors) => {
  console.log('errors!!', errors);
  const errorsObj = Object.values(errors).map((elem) => {
    console.log('elem', elem.message);
  });
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
    res.status(500).json({
      status: 'Error',
      err,
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
    console.log('error.name', error.errors.name.name);
    //Wrong string instead of /:id
    if (error.kind === 'ObjectId') error = handleObjectIdError(error);
    //Dublicate name on unique
    if (error.code === 11000) error = handleDuplicateFieldsError(err.message);
    //Validation in Schema fields
    if (error.errors.name.name === 'ValidatorError')
      error = handleValidationError(error.errors.name);

    sendErrorProd(error, res);
  } else {
    console.log('test');
  }
};
