const fs = require('fs');
const express = require('express');
const { log } = require('console');
const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const tour = tours.find((elem) => elem.id === req.params.id * 1); //convert to number
  console.log('tour', tour);
  if (!tour) {
    return res.status(400).json({ error: 'No Tours found' });
  }
  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
});
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
app.post('/api/v1/tours', (req, res) => {
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
});
//Update File Data
app.patch('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    result: 'success',
    tour: 'Updated',
  });
});

const port = 3000;
app.listen(3000, () => {
  console.log(`Server is listening on port ${port}`);
});
