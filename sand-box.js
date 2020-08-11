const obj = {
  duration: 5,
  difficulty: 'easy',
  price: 500,
  page: 'new',
  sort: 'true',
};

const newObj = { ...obj };
newObj.price = 400;
newObj.duration = 7;
const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach((elem) => delete newObj[elem]);
excludedFields.map((elem) => {
  console.log(elem);
  delete newObj[elem];
});

console.log('obj', obj);
console.log('newObj', newObj);
