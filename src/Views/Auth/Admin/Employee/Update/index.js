import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { Button, Form, Col, Row, InputGroup, Alert } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

// Import both component for file upload
import bsCustomFileInput from 'bs-custom-file-input';
import { ResizeImage } from "../../../../../Components/FileUpload"

// Import both component for select
import Select from 'react-select'

import Loading from "../../../../Loading";
import AdminLayout from "../../../../Layouts/AdminLayout";

export default function EmployeeUpdate() {
  const history = useHistory();
  const [cookies] = useCookies(["csrf"]);
  let { id } = useParams();

  useEffect(() => {
    fetchUpdateFormData();
    return () => {
      bsCustomFileInput.destroy()
    }
    // eslint-disable-next-line
  }, [])
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const clearNotify = () => {
    setSuccessMessage("");
    setErrorMessage("")
  }

  const [isLoading, setIsLoading] = useState(true);

  const [picture, setPicture] = useState([]);
  const [etOptions, setEtOptions] = useState([])
  const [dlOptions, setDlOptions] = useState([])
  const [etSelected, setEtSelected] = useState({})
  const [dlSelected, setDlSelected] = useState({})
  const formRef = useRef();

  const [state, setState] = useState({
    name: "",
    address: "",
    phone: 0,
    age: 0,
    gender: "",
    avatar: "",
    identity_card: "",
    employee_type_id: 0,
    delivery_location_id: 0,
  });

  const name = state.name;
  const address = state.address;
  const phone = state.phone;
  const age = state.age;
  const gender = state.gender;
  const identity_card = state.identity_card;

  const fetchUpdateFormData = async () => {
    setIsLoading(true);
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": cookies.csrf,
      },

      credentials: "include",
      method: "GET",
    };

    await fetch(`/scem-user/api/employee/update-form-data/${id}`, requestOptions)
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject("Bad request sent to server!");
        }
        return res.json();
      })
      .then((json) => {
        setState(json.employee_info);
        setEtOptions(json.et_options);
        setDlOptions(json.dl_options);
        json.et_options.map((option) => {
          if (option.value === json.employee_info.employee_type_id) {
            setEtSelected(option)
          }
          return 1;
        });
        json.dl_options.map((option) => {
          if (option.value === json.employee_info.delivery_location_id) {
            setDlSelected(option)
          }
          return 1;
        });
        setIsLoading(false);
        bsCustomFileInput.init()
      })
      .catch((err) => {
        console.log(err);
      });

  };

  const handleChange = (event) => {
    if (typeof event.target !== "undefined") {
      const { name, value, valueAsNumber } = event.target;
      setState((prevState) => {
        return { ...prevState, [name]: valueAsNumber || value };
      });
    } else {
      const { name, value } = event;
      setState((prevState) => {
        return { ...prevState, [name]: value };
      });
    }
  };

  const onChangePicture = e => {
    setPicture([...picture, e.target.files[0]]);
  };

  const resetForm = () => {
    formRef.current.reset()
    setPicture([]);
  };

  const submitImage = async () => {

    //Source code: https://stackoverflow.com/a/37953610
    if (picture && picture.length) {
      const config = {
        file: picture[0],
        maxSize: 300
      };
      const resizedImage = await ResizeImage(config)

      let formData = new FormData();
      formData.append("file", resizedImage, picture[0].name);

      const requestOptions = {
        headers: {
          "X-CSRF-Token": cookies.csrf,
          Accept: "application/json",
        },

        credentials: "include",
        method: "POST",
        body: formData,
      };

      return await fetch("/scem-user/api/employee/upload/image", requestOptions)
        .then((res) => {
          if (res.status !== 201) {
            return Promise.reject('Bad request sent to server!');
          }
          return res.json();
        })
        .then(async (data) => {
          console.log(data.filename)
          // Keep in mind this a very dangerous way to change state of component!!!!!
          state.avatar = data.filename;
          setState((prevState) => {
            return { ...prevState, avatar: data.filename };
          });
        })
    } else {
      return await console.log();
    }

  };

  const handleSubmit = (e) => {
    clearNotify()
    e.preventDefault();

    return submitImage()
      .then(() => {
        const requestOptions = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": cookies.csrf,
          },

          credentials: "include",
          method: "PUT",
          body: JSON.stringify(state),
        };

        return fetch(`/scem-user/api/employee/update/${id}`, requestOptions);
      })
      .then((res) => {
        if (res.status !== 200) {
          return Promise.reject("Bad request sent to server!");
        }
        return res.json();
      })
      .then(data => setSuccessMessage(data.server_response))
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <AdminLayout>
        <p className="employee-create-header">Update employee</p>

        {successMessage !== "" ? (<Alert key={3} variant="success">Server response: {successMessage}</Alert>) : (<></>)}
        {errorMessage !== "" ? (<Alert key={3} variant="danger">Server response: {errorMessage}</Alert>) : (<></>)}


        <Form ref={formRef} className="content" onSubmit={(e) => handleSubmit(e)}>
          <Form.Group as={Row} controlId="formHorizontalAvatar">
            <Form.Label column sm={2}>
              Avatar
          </Form.Label>
            <Col sm={10}>
              <InputGroup>
                <Form.File
                  name="file"
                  id="custom-file"
                  label="Select file"
                  onChange={onChangePicture}
                  accept="image/*"
                  custom
                />
                <InputGroup.Append>
                  <Button className="btn btn-10" onClick={resetForm}>Remove</Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalName">
            <Form.Label column sm={2}>
              Name
          </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalAddress">
            <Form.Label column sm={2}>
              Address
          </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="address"
                placeholder="Address"
                value={address}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalPhone">
            <Form.Label column sm={2}>
              Phone
          </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                name="phone"
                placeholder="Phone"
                value={phone}
                onChange={handleChange}
                required
                min="100000000"
                max="9999999999"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalAge">
            <Form.Label column sm={2}>
              Age
          </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                name="age"
                value={age}
                onChange={handleChange}
                min="1"
                max="99"
                required
              />
            </Col>
          </Form.Group>

          <fieldset>
            <Form.Group as={Row} controlId="formHorizontalGender">
              <Form.Label as="book" column sm={2}>
                Gender
            </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="radio"
                  label="Male"
                  value="male"
                  name="gender"
                  id="genderRadios1"
                  onChange={handleChange}
                  checked={gender === "male"}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  value="female"
                  name="gender"
                  id="genderRadios2"
                  onChange={handleChange}
                  checked={gender === "female"}
                />
                <Form.Check
                  type="radio"
                  label="Others"
                  value="others"
                  name="gender"
                  id="genderRadios3"
                  onChange={handleChange}
                  checked={gender === "others"}
                />
              </Col>
            </Form.Group>
          </fieldset>

          <Form.Group as={Row} controlId="formHorizontalIdentityCard">
            <Form.Label column sm={2}>
              Identity card
          </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="identity_card"
                placeholder="Identity Card"
                value={identity_card}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalSelectEmployeeType">
            <Form.Label column sm={2}>Employee type</Form.Label>
            <Col sm={10}>
              <Select options={etOptions} onChange={handleChange} defaultValue={etSelected} />
            </Col>

          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalSelectDeliveryLocation">
            <Form.Label column sm={2}>Delivery location</Form.Label>
            <Col sm={10}>
              <Select options={dlOptions} onChange={handleChange} defaultValue={dlSelected} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ span: 1, offset: 2 }}>
              <Button className="btn-6" type="submit">
                Update
            </Button>
            </Col>

            <Col sm={{ span: 1 }}>
              <Button className="btn-7" onClick={() => history.push("/employee/list")}>
                Cancel
            </Button>
            </Col>

          </Form.Group>
        </Form>
      </AdminLayout>
    );
  }
}
