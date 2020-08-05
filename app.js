const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tours = require('./routes/tours');
const users = require('./routes/users');

const app = express();
app.use(express.json());

//WRITE OUR OWN MIDDLEWARE
app.use(morgan('dev'));
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

module.exports = app;
