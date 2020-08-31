//Create Reusable class
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //methods
  filter() {
    //1)Filtering
    const queryObj = { ...this.queryString };
    const exludeFields = ['page', 'sort', 'limit', 'fields'];
    //Remove those keys from req.query
    exludeFields.forEach((elem) => delete queryObj[elem]);
    //2) Advanced Filtering
    // console.log('queryObj', queryObj);
    let queryStr = JSON.stringify(queryObj);
    //if in query string :gt,gte,lte,lt
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);
    // console.log('queryStr', JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      console.log('this.queryString', this.queryString);
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log('sortBy :', sortBy);

      this.query = this.query.sort(sortBy);
    } else {
      //sort by date created
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log('fields :', fields);
      this.query = this.query.select(fields);
    } else {
      // with - we exclude keys from this.query
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 30;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit * 1);
    return this;
  }
}
module.exports = APIFeatures;
