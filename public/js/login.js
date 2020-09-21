/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';
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
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log('err.response.data', err.response.data.message);

    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/users/logout');
    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
