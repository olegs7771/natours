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
    alert(err.response.data.message);
  }
};

const login = async (email, password) => {
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
    alert(err.response.data);
  }
};
if (document.querySelector('.form')) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('email', email);
    console.log('password', password);
    login(email, password);
  });
}
if (document.querySelector('.nav__el--logout')) {
  document.querySelector('.nav__el--logout').addEventListener('click', () => {
    logout();
  });
}
