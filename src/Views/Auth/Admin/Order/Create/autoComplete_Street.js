import React from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const AutoCompleteStreet = () => {
  function onPlaceSelect(value) {
  }
  function onSuggestionChange(value) {
    console.log(value);
  }

  return (
    <GeoapifyContext apiKey="4d44a4f90c0b40dd9fcf8673380e8f44">
      <GeoapifyGeocoderAutocomplete
        placeholder="Enter address here"
        lang="vi"
        countryCodes="vn"
        limit="5"
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
      />
    </GeoapifyContext>
  );
};

export default AutoCompleteStreet;