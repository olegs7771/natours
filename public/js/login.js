/*eslint-disable*/
import { showAlert } from './alerts';
import axios from 'axios';

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');

    console.log('res', res);
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
      showAlert('success', 'Successefully logged out');
    }
  } catch (err) {
    // console.log('err.response.data', err.response.data.message);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};

export const login = async (email, password) => {
  const data = { email, password };
  console.log('data', data);
  try {
    const res = await axios.post('/api/v1/users/login', data);

    console.log('res', res);
    if (res.data.status === 'success') {
      showAlert('success', 'Successefully loged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log('err.response.data', err.response.data.message);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};
