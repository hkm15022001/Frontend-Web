import React from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const AutoCompleteState = ({ onSelect }) => {
  const referenceCoordinates = { lat: 21.0285, lng: 105.8542 }; ///lat,long of hanoi

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  function onPlaceSelect(value) {
    console.log(value.geometry.coordinates);
    const selectedCoordinates = {
      lat: value.geometry.coordinates[1],
      lng: value.geometry.coordinates[0],
    };

    const distance = calculateDistance(
      referenceCoordinates.lat,
      referenceCoordinates.lng,
      selectedCoordinates.lat,
      selectedCoordinates.lng
    );
    const city = value.properties.city !== undefined ? value.properties.city : value.properties.rank.state !== undefined ?  value.properties.rank.state : value.properties.address_line1;
    console.log(parseInt(distance), city)
    onSelect({
      city: city.replace(/tỉnh|thành phố|/gi,"").trim(),
      ship_distance: parseInt(distance), // Rounded distance to 2 decimal places
    });
  }

  function onSuggestionChange(value) {
    console.log(value);
  }

  return (
    <GeoapifyContext apiKey="4d44a4f90c0b40dd9fcf8673380e8f44">
      <GeoapifyGeocoderAutocomplete
        placeholder="Enter address here"
        // type="city"
        lang="vi"
        countryCodes="vn"
        limit="5"
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
      />
    </GeoapifyContext>
  );
};

export default AutoCompleteState;
