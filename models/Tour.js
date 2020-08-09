const mongoose = require('mongoose');
//Create Schema for Model
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  rating: {
    type: Number,
    default: 4.7,
  },
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
