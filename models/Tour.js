const mongoose = require('mongoose');
//Create Schema for Model
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A must have the group size '],
    max: [20, 'The group size too large'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty level'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [300, 'Too cheap price'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.7,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
