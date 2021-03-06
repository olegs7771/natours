/*eslint-disable*/

//Type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';
    const res = await axios.patch(url, data);
    console.log('res.data', res.data);
    if (res.data.status === 'success') {
      alert(`${type.toUpperCase()} updated successfully!`);
      window.location.assign('/me');
    }
  } catch (err) {
    console.log('error to update', err.response.data);
  }
};

const formUpdateData = document.querySelector('.form-user-data');
const formUpdatePassword = document.querySelector('.form-user-password');
const formDataUpdateBtn = document.querySelector('.btn--green');
const formPasswordUpdateBtn = document.querySelector('.btn--save-password');

if (formUpdateData) {
  formDataUpdateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', document.getElementById('name').value);
    fd.append('email', document.getElementById('email').value);
    fd.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    updateSettings(fd, 'data');
  });
}
if (formUpdatePassword) {
  formPasswordUpdateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password-current').value;
    const newpassword = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const data = { password, newpassword, passwordConfirm };
    // console.log('data password', data);

    // console.log('updating..');
    document.querySelector('.btn--save-password').textContent = 'Updating..';
    await updateSettings(data, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    // console.log('updated');
  });
}
