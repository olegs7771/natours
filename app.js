const path = require('path');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tours = require('./routes/tours');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const bookings = require('./routes/bookings');
const viewsRouter = require('./routes/viewsRouter');
const errorControl = require('./controllers/errorController');

const app = express();
app.enable('trust proxy'); //Heroku works through proxies
//in order in authController.js createSendToken function
// be able to use  secure: req.secure || req.headers['x-forwarded-proto'] === 'https',

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors()); //for pre-flight requests
//Helmet For security HTTP  Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': [
        "'self'",
        'ws://127.0.0.1:*',
        'data:',
        'api.mapbox.com',
        'events.mapbox.com',
      ],
      'script-src': ["'self'", 'js.stripe.com', 'api.mapbox.com', 'blob:'],
      'object-src': ["'none'"],
      'frame-src': ['ws://127.0.0.1:*', 'js.stripe.com/'],
    },
  })
);

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
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log('req.cookies', req.cookies);
//   next();
// });
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

app.use(compression());
//WRITE OUR OWN MIDDLEWARE
//Serve templates routes

app.use('/', viewsRouter);
app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/bookings', bookings);

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
