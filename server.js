const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(process.env.NODE_ENV);
const port = process.env.PORT || 5000;
app.listen(3000, () => {
  console.log(`Server is listening on port ${port}`);
});
