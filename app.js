const express = require('express');
const morgan = require('morgan');
const tours = require('./routes/tours');
const users = require('./routes/users');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//WRITE OUR OWN MIDDLEWARE

app.use((req, res, next) => {
  console.log('First Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);

// Not existing routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error Handling in Express (app)
app.use(globalErrorHandler);

module.exports = app;
