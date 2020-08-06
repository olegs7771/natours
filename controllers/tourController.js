const fs = require('fs');
//Get Tours Sync!
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Create check for id middleware
const checkID = (req, res, next, val) => {
  const tour = tours.find((elem) => elem.id === req.params.id * 1);
  if (!tour)
    return res.status(400).json({
      result: 'Error',
      message: 'Tour not found from middleware check',
    });
  next();
};

//Ceck for Post (AddTour)
const checkNewTour = (req, res, next) => {
  console.log('req.body middleware post', req.body);
  if (!req.body.name) {
    return res.status(400).json({
      result: 'Error',
      message: 'Name can not be empty',
    });
  }
  next();
};

//Get All Tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',

    results: tours.length,
    data: {
      tours,
    },
  });
};
//Get Tour
const getTour = (req, res) => {
  console.log('req.params', req.params);
  const tour = tours.find((elem) => elem.id === req.params.id * 1);

  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
};
//Add New Tour
const addNewTour = (req, res) => {
  console.log('req.body', req.body);
  //Create id for last item
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  //persist data in file

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(400).json({
          response: 'Error',
          error: err,
        });
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
  console.log('req', req);
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

module.exports = {
  getAllTours,
  getTour,
  deleteTour,
  updateTour,
  addNewTour,
  checkID,
  checkNewTour,
};
