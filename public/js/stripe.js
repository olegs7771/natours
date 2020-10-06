/*eslint-disable*/
const stripe = Stripe(
  'pk_test_51HYQowAwETtguWEQkKgdyt1IZgugTb4uPkJCxyDnbdzezk3Ei7WehhHwc74nrEmMgLiWSb9KZcYOIwGXbko763Hx00m3F7KcZt'
);

const bookBtn = document.getElementById('book-tour');

const bookTour = async (tourId) => {
  // 1) Get checkout session from API
  try {
    bookBtn.textContent = 'Processing';
    const session = await axios.get(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log('session', session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log('error', err);
  }
};

bookBtn.addEventListener('click', (e) => {
  console.log('e', e.target.dataset.tourId);
  bookTour(e.target.dataset.tourId);
});
