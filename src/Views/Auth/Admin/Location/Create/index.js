// import "./index.css";
import React, { useState } from "react";
import { Button, Form, Col, Row, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import LocationMap from "./LocationMap";
import AdminLayout from "../../../../Layouts/AdminLayout";

export default function LocationCreate() {
  const history = useHistory();
  const [cookies] = useCookies(["csrf"]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const clearNotify = () => {
    setSuccessMessage("");
    setErrorMessage("")
  }


  const [state, setState] = useState({
   city: "",
   latitude: 0.0,
   longitude: 0.0
  });
  const city = state.city;
  const latitude = state.latitude;
  const longitude = state.longitude;
 
  const handleMapSelect = (locationDetails) => {
    setState(prevState => ({
      ...prevState,
      city: locationDetails.city,
      latitude: locationDetails.latitude,
      longitude: locationDetails.longitude
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if(city === "" | latitude === 0.0 | longitude === 0.0 ) {
      setErrorMessage("Please select delivery location")
      return
    }

    clearNotify()

    const requestOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": cookies.csrf,
      },

      credentials: "include",
      method: "POST",
      body: JSON.stringify(state),
    };

    return fetch("/scem-user/api/delivery-location/create", requestOptions)
      .then((res) => {
        if (res.status !== 201) {
          return Promise.reject("Bad request sent to server!");
        }
        return res.json();
      })
      .then(data => setSuccessMessage(data.server_response))
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <AdminLayout>
      <p className="location-create-header">Create Delivery Loaction</p>
      <Form className="content" sm={4} onSubmit={(e) => handleSubmit(e)}>
       <LocationMap onSelect={handleMapSelect}/>
        <Form.Group as={Row} controlId="formHoriddzontalsAddress" style={{ marginTop: '20px' }}>
            <Form.Label column sm={2}>
              City
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="city"
                value={city}
                disabled={true} 
              />
            </Col>
        </Form.Group>


        <Form.Group as={Row} controlId="formHoriddzontalsAddress">
            <Form.Label column sm={2}>
              Latitude
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                name="latitude"
                value={latitude}
                disabled={true} 
              />
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHoriddzontalsAddress">
            <Form.Label column sm={2}>
              Longitude
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                name="longitude"
                value={longitude}
                disabled={true} 
              />
            </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 1, offset: 2 }}>
            <Button className="btn-6" type="submit">
              Create
            </Button>
          </Col>

          <Col sm={{ span: 1 }}>
            <Button className="btn-7" onClick={() => history.push("/delivery-location/list")}>
              Cancel
            </Button>
          </Col>
        </Form.Group>
      </Form>
      {successMessage !== "" ? (<Alert key={3} variant="success">Server response: {successMessage}</Alert>) : (<></>)}
      {errorMessage !== "" ? (<Alert key={3} variant="danger">Server response: {errorMessage}</Alert>) : (<></>)}
    </AdminLayout>
  );
}
