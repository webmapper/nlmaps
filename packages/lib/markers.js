import { getMarker, testWhichLib, createMarkerLayer, mapPointerStyle } from './index.js';

let markerStore = {
  removeMarker: function () {
    markerStore.marker.remove();
    delete markerStore.marker;
  }
};

let lib = testWhichLib();

function singleMarker(map, popupCreator) {
  mapPointerStyle(map);
  return (t, d) => {
    if (t === 1 ) {
      if (markerStore.marker) {
        markerStore.marker.remove();
      }
      let newmarker = createMarkerLayer(lib, map, {latitude: d.latlng.lat, longitude: d.latlng.lng})
      markerStore.marker = newmarker;
      markerStore.marker.addTo(map);
      if (popupCreator) {
        let div = popupCreator.call(markerStore, d);
        let popup = L.popup({offset: [0,-50]})
          .setContent(div)
        markerStore.marker.bindPopup(popup).openPopup();
      } else {
        markerStore.marker.on('click', function() {
          markerStore.removeMarker();
        })
      }
    }
  }
}

function multiMarker(e) {
  if (markerStore.markers && markerStore.markers.length > 0) {
    let hasSameLoc = markerStore.markers.find(el => spatialEq(el._latlng, e)) // any one has same location as new click?  
    if (typeof hasSameLoc !== 'undefined') {
      return;
    }

  }
}

export { singleMarker, markerStore };
