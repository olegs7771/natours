const { promisify } = require('util');

const sum = (x, y, cb) => {
  const result = x + y;

  cb(result);
};

// sum(5, 7, (cb) => {
//   console.log('cb', cb);
// });

const asyncFunc = async (x, y) => {
  try {
    const promiseResult = await promisify(sum)(x, y);
    return promiseResult;
  } catch (err) {
    console.log('err', err);
  }
};

console.log('asyncFunc', asyncFunc(5, 4));
