import { getMarker, mapPointerStyle } from './index.js';

function addMarkerCloseOnClick(marker, map, lib){
  switch (lib) {
    case 'leaflet':
      marker.on('click', function() {
        markerStore.removeMarker(marker);
      });
      break;
    case 'googlemaps':
      marker.addListener('click', function() {
        marker.setMap(null);
        marker = null;
      });
      break;
    case 'openlayers':
      marker.id = 'marker';
      map.on('click', function(e) {
        map.forEachFeatureAtPixel(e.pixel, f => {
          if ( marker.getSource().getFeatures()[0] === f) {
            map.removeLayer(marker);
          }
        
        });
      });

  }
}

let markerStore = {
  markers: [],
  removeMarker: function (marker) {
    let idx = markerStore.markers.findIndex(x => x === marker)
    markerStore.markers[idx].remove();
    markerStore.markers.splice(idx, 1);
  },
  addMarker: function(marker, remove=false, map) {
    markerStore.markers.push(marker);
    if (remove) {
        addMarkerCloseOnClick(marker, map, nlmaps.lib)
    }
  }
};

function createAndAddMarker(map, d, popupCreator) {
    let newmarker = L.marker([d.latlng.lat,d.latlng.lng], {
        alt: 'marker',
        icon: new L.icon({
            iconUrl: getMarker().url,
            iconSize: getMarker().iconSize,
            iconAnchor: getMarker().iconAnchor
        })
    });
    newmarker.addTo(map);
    if (popupCreator) {
        let div = popupCreator.call(markerStore, d, newmarker);
        let popup = L.popup({offset: [0,-50]})
            .setContent(div)
        newmarker.bindPopup(popup).openPopup();
        markerStore.addMarker(newmarker, false, map);
    } else {
        markerStore.addMarker(newmarker, true, map);
    }
}

function singleMarker(map, popupCreator) {
  mapPointerStyle(map);
  return (t, d) => {
    if (t === 1 ) {
      if (markerStore.markers[0]) {
        markerStore.removeMarker(markerStore.markers[0]);
      }
      createAndAddMarker(map, d, popupCreator);
    }
  }
}

function multiMarker(map, popupCreator) {
  mapPointerStyle(map);
  return (t, d) => {
    if (t === 1 ) {
      createAndAddMarker(map, d, popupCreator);
    }
  }

}

export { singleMarker, multiMarker, markerStore };
