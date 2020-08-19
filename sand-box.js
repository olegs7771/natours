const myAsyncTask = (value) => {
  return new Promise((resolve, reject) => {
    if (value > 10) {
      setTimeout(() => resolve('true number'), 1000);
    } else {
      setTimeout(() => reject(new Error(`${value} is a wrong number`)), 1000);
    }
  });
};

const asyncCatch = (fn) => {
  return (result) => {
    fn(result).catch((err) => console.log('err', err));
  };
};

const check = asyncCatch(async () => {
  const result = await myAsyncTask(1);
  console.log('result', result);
});
check();
console.log('test');
