const Tour = require('../models/Tour');
// const User = require('../models/User');
// const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
    title: '| All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // 1)get the data for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    field: 'review',
  });
  console.log('tour', tour);

  // 2) Build template
  // 3) Render template using data from 1
  res.status(200).render('tour', {
    title: `| ${tour.name} Tour`,
    tour,
  });
});

module.exports = { getOverview, getTour };
