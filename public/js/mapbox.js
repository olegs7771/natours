/* eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoib2xlZ3M3NzciLCJhIjoiY2tmZ2pkd3BhMHA0cjJ0cXY2bnF3ejJtYiJ9.tpuh7yaxFpWdr5Iru4nMGw';

  // const locations = JSON.parse(
  //   document.getElementById('map').dataset.locations
  // );
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/olegs777/ckf9c8omb0if119rwgysy93wg',
    // interactive: false,
    scrollZoom: false,
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
    //Add Popup
    new mapboxgl.Popup({
      offset: 40,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
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
};
