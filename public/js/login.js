/*eslint-disable*/

const login = async (email, password) => {
  const data = { email, password };
  console.log('data', data);
  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/login',
      data
    );

    console.log('res', res);
  } catch (err) {
    console.log('err :', err.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
