const mongoose = require('mongoose');
// const dotenv = require('dotenv');
require('dotenv').config();
//Handle Uncaught Exeptions (errors,bugs in asynchrones code)
process.on('uncaughtException', (err) => {
  // console.log(err.name, ':', err.message);
  // console.log('UNCAUGHT EXEPTION 💥 Shutting Down..');
  process.exit(1);
});
const app = require('./app');

// dotenv.config({ path: './config.env' });
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB natours connected !');
  });

console.log(process.env.NODE_ENV);
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
//Handle UnhandledRejections Errors Globali using even listner
process.on('unhandledRejection', (err) => {
  // console.log(err.name);
  // console.log(err.message);
  console.log('UNHANDLED REJECTION 💥 Shutting Down..');
  server.close(() => {
    process.exit(1);
  });
});
