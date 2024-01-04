import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import custom marker
import customMarkerImg from '../../../../../Statics/logo/venue-icon.svg'; 

const MapComponent = ({ data }) => {
  const mapRef = useRef(null);
  let map = null;
  let markers = [];

  useEffect(() => {
     // eslint-disable-next-line 
    map = L.map(mapRef.current).setView([0, 0], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // create icon custom marker 
    const customMarkerIcon = L.icon({
      iconUrl: customMarkerImg, // url
      iconSize: [38, 38], //size image for marker
      iconAnchor: [19, 38], 
      popupAnchor: [0, -38] // Điểm neo của cửa sổ pop-up, nếu sử dụng
    });
    console.log(data.length)
    if (data && data.length > 0) {
      data.forEach(coord => {
        const { latitude, longitude } = coord;
        const marker = L.marker([latitude, longitude], { icon: customMarkerIcon }).addTo(map);
        markers.push(marker);
      });

      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds());
    }

    return () => {
      map.remove();
    };
  }, [data]);

  return <div style={{ height: '400px' }} ref={mapRef}></div>;
};

export default MapComponent;
