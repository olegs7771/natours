const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const sharp = require('sharp');
const sizeOf = require('image-size');

const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const getCheckOutSession = catchAsync(async (req, res, next) => {
  // 1) Get curruntly booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `https://images.theconversation.com/files/305661/original/file-20191206-90618-6l114c.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&h=503&fit=crop&dpr=1`,
          `https://i.imgur.com/EHyR2nP.png`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

module.exports = { getCheckOutSession };
