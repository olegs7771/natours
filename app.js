const express = require('express');
const morgan = require('morgan');
const tours = require('./routes/tours');
const users = require('./routes/users');
const errorControl = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//WRITE OUR OWN MIDDLEWARE

app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);

// Not existing routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

//Error Handling in Express (app)
app.use(errorControl);

module.exports = app;
