/*eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login';
import { showAlert } from './alerts';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';

// // DOM Elements
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const mapBox = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');

// //Delegation
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (document.querySelector('.form')) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (loginForm) {
  document.querySelector('.form--login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log('email', email);
    // console.log('password', password);
    login(email, password);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    // console.log('e', e.target.dataset.tourId);
    bookTour(e.target.dataset.tourId);
  });
}
