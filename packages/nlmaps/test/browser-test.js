/* eslint-disable no-console */
let map = nlmaps.createMap({target: 'mapdiv', marker: true, search: true, style: 'standaard'})
//const geolocator = nlmaps.geoLocate(map, {start: true});

nlmaps.on('search-select', x => console.log(x));



