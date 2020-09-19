/* eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log('locations', locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xlZ3M3NzciLCJhIjoiY2tmOTdqb2hoMGI5ZTMybGRlOThmZW1lciJ9.VaNwOUNQ0qe6cicT0UsCGQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/olegs777/ckf9c8omb0if119rwgysy93wg',
  interactive: false,
  // center: [-73.5804, 45.53483],
  // pitch: 0,
  // bearing: -60,
  // zoom: 10,
});

const bounds = new mapboxgl.LngLatBounds();
locations.map((loc) => {
  //Create Marker
  const elem = document.createElement('div');
  elem.className = 'marker';
  //Add Marker
  new mapboxgl.Marker({
    element: elem,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  //Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
