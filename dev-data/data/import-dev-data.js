const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/Tour');

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
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//Import Data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded');
    process.exit();
  } catch (err) {
    console.log('err :', err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('all deleted');
    process.exit();
  } catch (err) {
    console.log('err to delete ', err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();

  // process.exit();
}
console.log(process.argv);
//