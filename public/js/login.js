/*eslint-disable*/

import axios from 'axios';
export const login = async (email, password) => {
  const data = { email, password };
  console.log('data', data);
  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/login',
      data
    );

    console.log('res', res);
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log('err.response.data', err.response.data.message);
    alert(err.response.data.message);
  }
};
