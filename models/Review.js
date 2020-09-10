//revie /rating/createAt/ ref to tour/ref to user
//pre uses next()
//post NO next()!!
const mongoose = require('mongoose');
const Tour = require('./Tour');

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
//Get Reviews for particular Tour
reviewSchema.pre(/^find/, function (next) {
  this.populate({
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

//Static function for calculating in Tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  console.log('this in func', this);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, //finds all reviews of one tour
    },
    {
      $group: {
        //calculates average of all reviews
        _id: 'tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log('stats', stats);
  //Persisit stats in Tour DB
  await Tour.findByIdAndUpdate(
    tourId,
    {
      //updates tour with calculated data
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    },
    {
      new: true,
    }
  );
};
reviewSchema.post('save', function () {
  //calling static function
  //this.constructor-->points to Model
  //this -->points to document to be saved
  this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndUpdate findByIdAndDelete ==> query Middleware. mongoDB  uses findOneAndUpdate,findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //save to this to move from pre to post document
  this.r = await this.findOne();
  console.log('this.r pre', this.r);
  this.time = Date.now();

  next();
});
//passing this to post
reviewSchema.post(/^findOneAnd/, async function () {
  //await this.findOne(); does NOT work here! query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
  console.log('this.r post', this.r);
  console.log('time', Date.now() - this.time);
  console.log();
});

//Allow nested routes
//  if (!req.body.tour) req.body.tour = req.params.tourId;
//  if (!req.body.user) req.body.user = req.user.id;
// reviewSchema.pre('save',function(next){

// })

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
