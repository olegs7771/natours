/*eslint-disable*/

const logout = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/users/logout');

    console.log('res.dat', res.data);
    // if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log('err.response.data', err.response.data);
  }
};
if (document.querySelector('.nav__el--logout')) {
  document.querySelector('.nav__el--logout').addEventListener('click', () => {
    logout();
  });
}
