const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// const User = require('./User');
//Create Schema for Model
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour name must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour must have less or equal then 40 characters'],
      minlength: [10, 'A Tour must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must contain only characters '],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [300, 'Too cheap price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.7,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, //set function runs every time new value sets in
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          console.log('val', val);
          //this points to new document only on the creation of new document
          return val < this.price;
        },
        message: 'Discount price {VALUE} can not be higher than original price',
      },
    },
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Accepts only Point ',
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        // type: mongoose.Schema.ObjectId,
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],

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
//Set Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//Document Middleware
//Executed on .save() or .create() but not on insertMany()!
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//tour.guides populated with objects by id (embedding)
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(
//     async (guide) => await User.findById(guide)
//   );
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

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
  //this.find({ secretTour: { $ne: false } }); //find only secret tours
  this.start = Date.now();
  // this.select('name');
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name photo role',
  });
  next();
});

//RUNS after query executed
//this points to doc found in DB
tourSchema.post(/^find/, async function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}  milliseconds`);
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().push({
    $match: {
      secretTour: { $ne: true },
      // secretTour: false,
    },
  });
  console.log('this aggregation pipeline', this.pipeline());
  next();
});

//virtual params not persisted in DB
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Virtualy populate tour with reviews on every query find

tourSchema.virtual('reviews', {
  ref: 'Review', //Connects to Review schema
  foreignField: 'tour',
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
