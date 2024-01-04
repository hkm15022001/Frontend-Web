import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import './index.css'; // Update the file path according to your CSS file location

const LocationMap = ({onSelect}) => {
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  let marker = null;

  useEffect(() => {
    const myAPIKey = "4d44a4f90c0b40dd9fcf8673380e8f44";

    const map = L.map(mapRef.current, { zoomControl: false }).setView([38.908838755401035, -77.02346458179596], 12);

    const isRetina = L.Browser.retina;
    const baseUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
    const retinaUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
      apiKey: myAPIKey,
      maxZoom: 20,
      id: 'osm-bright'
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    const autocompleteInput = new GeocoderAutocomplete(
      autocompleteRef.current,
      myAPIKey,
      { lang: "vi", countryCodes:["vn"], limit:"5" });

    const markerIcon = L.icon({
      iconUrl: `https://api.geoapify.com/v1/icon/?type=awesome&color=%232ea2ff&size=large&scaleFactor=2&apiKey=${myAPIKey}`,
      iconSize: [38, 56],
      iconAnchor: [19, 51],
      popupAnchor: [0, -60]
    });
    autocompleteInput.on('suggestions', (location) => {
        console.log(location)
    })
    autocompleteInput.on('select', (location) => {
      if (marker) {
        marker.remove();
      }

      if (location) {
        // eslint-disable-next-line
        marker = L.marker([location.properties.lat, location.properties.lon], {
          icon: markerIcon
        }).addTo(map);

        map.panTo([location.properties.lat, location.properties.lon]);
        const city = location.properties.city !== undefined ? location.properties.city : location.properties.rank.state !== undefined ?  location.properties.rank.state : location.properties.address_line1;
        // console.log(city.replace(/tỉnh|thành phố|/gi,"").trim())
        onSelect({
            city:city.replace(/tỉnh|thành phố|/gi,"").trim(),
            latitude: location.geometry.coordinates[1],
            longitude: location.geometry.coordinates[0]
        })
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="map-container">
      <div id="map" ref={mapRef}></div>
      <div className="autocomplete-panel">
        <div id="autocomplete" ref={autocompleteRef}></div>
      </div>
    </div>
  );
};

export default LocationMap;
