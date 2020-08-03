const express = require('express');
const app = express();

app.get('./api/v1/tours', (req, res) => {});

const port = 3000;
app.listen(3000, () => {
  console.log(`Server is listening on port ${port}`);
});
