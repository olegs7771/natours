/*eslint-disable*/

const updateSettings = async (data) => {
  try {
    const res = await axios.post('/submit-user-data', data);
    console.log('res.data', res.data);
  } catch (err) {
    console.log('error to update', err.response.data);
  }
};

const formUpdateElem = document.querySelector('.form-user-data');
const formUpdateBtn = document.querySelector('.btn--green');

if (formUpdateElem) {
  formUpdateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const data = { name, email };
    updateSettings(data);
  });
}
