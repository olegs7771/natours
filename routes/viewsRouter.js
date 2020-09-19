const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewsController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'Tour Forest Hiker',
//     user: 'Oleg',
//   });
// });
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
