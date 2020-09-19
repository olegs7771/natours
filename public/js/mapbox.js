/* eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log('locations', locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xlZ3M3NzciLCJhIjoiY2tmOTdqb2hoMGI5ZTMybGRlOThmZW1lciJ9.VaNwOUNQ0qe6cicT0UsCGQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/olegs777/ckf9c8omb0if119rwgysy93wg',
  interactive: false,
});
