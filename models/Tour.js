const mongoose = require('mongoose');
const slugify = require('slugify');
//Create Schema for Model
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A must have the group size '],
      max: [40, 'The group size too large'],
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
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Document Middleware
//Executed on .save() or .create() but not on insertMany()!
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function (next) {
//   console.log('Will save document..');
//   next();
// });

// //post middleware we have access to saved Document
// tourSchema.post('save', function (doc, next) {
//   console.log('doc', doc);
//   next();
// });

//QUERY Middleware triggered on query like find()
//this object its query
//not works for findByID() in mongoDB findOne()
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
//Define rejex /^find/ to triger all find comands
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
//RUNS after query executed
//this points to doc found in DB
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//virtual params not persisted in DB
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
