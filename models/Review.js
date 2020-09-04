//revie /rating/createAt/ ref to tour/ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Please leave some review'],
      minlength: [10, 'Review min size 10 chars'],
    },
    rating: {
      type: Number,
      require: [true, 'Please rate the tour'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to the User'],
    },
    tour: {
      type: mongoose.Types.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to the Tour'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  })
    .populate({
      path: 'user',
      select: 'name ',
    })
    // .populate({
    //   path: 'user',
    //   select: 'name photo',
    // })
    .select('-__v');
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
