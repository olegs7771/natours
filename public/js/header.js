/*eslint-disable*/

const logout = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/users/logout');

    console.log('res', res);
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log('err.response.data', err.response.data.message);
    alert(err);
  }
};

document.querySelector('.nav__el--logout').addEventListener('click', () => {
  logout();
});
