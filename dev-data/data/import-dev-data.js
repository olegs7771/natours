const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../models/Tour');
const User = require('../../models/User');
const Review = require('../../models/Review');

dotenv.config({ path: './config.env' });
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB natours connected !');
  })
  .catch((err) => console.log('err:', err));
//Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
//Import Data into DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Tour.create(tours, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    console.log('data successfully loaded');
  } catch (err) {
    console.log('err to upload :', err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('all deleted');
  } catch (err) {
    console.log('err to delete ', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log('process.argv', process.argv);
//
