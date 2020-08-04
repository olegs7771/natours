const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

//WRITE OUR OWN MIDDLEWARE

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('First Middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//Get Tours Sync
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//Get  Users users.json
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

//Route Handlers
//Get Tour by id
const getTourById = (req, res) => {
  console.log(req.params);
  const tour = tours.find((elem) => elem.id === req.params.id * 1); //convert to number
  if (!tour) {
    return res.status(400).json({ error: 'No Tours found' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
//Get All Tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
//Add New Tour
const addNewTour = (req, res) => {
  //Create id for last item
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  //persist data in file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(400).json(err);
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
//Update File Data
const updateTour = (req, res) => {
  res.status(200).json({
    result: 'success',
    tour: 'Updated',
  });
};
//Delete File Data
const deleteTour = (req, res) => {
  res.status(200).json({
    result: 'success',
    tour: null,
  });
};

//Users
//Get All Users
const getAllUsers = (req, res) => {
  res.status(200).json({
    result: 'success',
    users,
  });
};
//Add User
const addUser = (req, res) => {
  res.status(200).json({
    result: 'user added',
  });
};
const getUser = (req, res) => {
  user;
};

// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addNewTour);
app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app
  .route('/api/v1/tours/:id')
  .delete(deleteTour)
  .get(getTourById)
  .patch(updateTour);

app.route('/api/v1/users').get(getAllUsers).post(addUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(3000, () => {
  console.log(`Server is listening on port ${port}`);
});
