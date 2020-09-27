/*eslint-disable*/

const hideAlert = () => {
  const el = documet.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

let markup;
const showAlert = (type, msg) => {
  hideAlert();
  markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};
