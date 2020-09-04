const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tours = require('./routes/tours');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const errorControl = require('./controllers/errorController');

const app = express();
//Helmet For security HTTP  Headers
app.use(helmet());

//Global Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//denail of service (DoS) attack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests.Try again in 15 min',
});
app.use('/api', limiter);
//Body Parser with limitted body
app.use(express.json({ limit: '10kb' }));

//Data  sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
//Prevent Parameters Pollution
app.use(
  hpp({
    whitelist: [
      'name',
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'createdAt',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//Serving static files
app.use(express.static(`${__dirname}/public`));

//WRITE OUR OWN MIDDLEWARE

app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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
