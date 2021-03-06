import React, { useState } from "react";
import history from "../app-history";
import { Col, Form, Button } from "react-bootstrap";
import { isValid, loginUser, registerUser } from "./services/user-service";
import { withRouter } from "react-router-dom";

const Register = () => {
  const defaultUser = {
    id: null,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    profileName: "",
    password: "",
    dob: "",
    userSummary: ""
  };
  
const defaultValidations = {
  hasError: false,
  fieldErrors: {
    idError: "",
    firstNameError: "",
    lastNameError: "",
    profileNameError: "",
    emailError: "",
    passwordError: "",
    DOBError: "",
    userSummaryError: "",
  },
  backendError: {
    statusCode: null,
    message: "",
    timestamp: "",
    details: [],
  },
};

const [user, setUser] = useState(defaultUser);

const [validations, setValidations] = useState(defaultValidations);
    

  const changePerson = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newUser = {
      ...user,
      [name]: value,
    };
    setUser(newUser);
  };

  const submitHandler = (e) => {
      e.preventDefault();
      const fieldErrors = { ...defaultValidations.fieldErrors };
      if (isValid(user, fieldErrors, "POST")) {
          registerUser(user).then(({ response, error }) => {
              if (!error) {
                  loginUser({ username: user.email, password: user.password }).then(({ response, error }) => {
                      if (!error) {
                          history.push("/");
                      }
                      else {
                          history.push("/login");
                      }
                  });
              }
              else {
                  setValidations({ ...validations, hasError: true, backendError: { ...error } });
              }
          })
      }
      else {
          setValidations({ hasError: true, fieldErrors: { ...fieldErrors }, backendError: {...defaultValidations.backendError} });
      }
  };

  return (
    <>
      <div style={{ height: "97vh" }}>
        <div className="row h-100 m-0">
          <div className="col-md-4 col-lg-4 col-sm-4 mx-auto my-auto rounded shadow bg-white">
            <div className="col-md-12 col-sm-12 col-lg-12 mx-auto mt-3">
              <h3>Recipes App</h3>
            </div>
            <Form noValidate onSubmit={submitHandler}>
              <div className="col-md-12 col-sm-12 col-lg-12 my-4 mx-auto">
                <h5>Register</h5>
              </div>

              <Form.Group as={Col} md={12} controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={user.firstName}
                  isInvalid={
                    validations.hasError &&
                    validations.fieldErrors.firstNameError
                  }
                  onChange={changePerson}
                />
                <Form.Control.Feedback type="invalid">{validations.fieldErrors.firstNameError}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12} controlId="middleName">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  id="middleName"
                  name="middleName"
                  type="text"
                  placeholder="Enter middle name"
                  value={user.middleName}
                  onChange={changePerson}
                />
              </Form.Group>
              <Form.Group as={Col} md={12} controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={user.lastName}
                  isInvalid={
                    validations.hasError &&
                    validations.fieldErrors.lastNameError !== ""
                  }
                  onChange={changePerson}
                />

                <Form.Control.Feedback type="invalid">{validations.fieldErrors.lastNameError}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={12} controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={user.email}
                  autoComplete="email"
                  onChange={changePerson}
                  isInvalid={
                    validations.hasError && validations.fieldErrors.emailError
                  }
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {validations.fieldErrors.emailError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={12} controlId="formProfileName">
                <Form.Label>Profile Name</Form.Label>
                <Form.Control
                  id="profileName"
                  name="profileName"
                  type="text"
                  placeholder="Enter a name you would like to chose for your profile"
                  value={user.profileName}
                  onChange={changePerson}
                  autoComplete="nickname"
                  isInvalid={
                    validations.hasError &&
                    validations.fieldErrors.profileNameError
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validations.fieldErrors.profileNameError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={12} controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={user.password}
                  onChange={changePerson}
                  isInvalid={
                    validations.hasError &&
                    validations.fieldErrors.passwordError
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validations.fieldErrors.passwordError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={12} controlId="formDOB">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  id="dob"
                  name="dob"
                  type="date"
                  value={
                    user.dob
                      ? new Date(user.dob).toISOString().substr(0, 10)
                      : ""
                  }
                  onChange={changePerson}
                  isInvalid={
                    validations.hasError && validations.fieldErrors.DOBError
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validations.fieldErrors.DOBError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={12} controlId="formUserSummary">
                <Form.Label>Something about yourself</Form.Label>
                <Form.Control
                  id="userSummary"
                  name="userSummary"
                  as="textarea"
                  rows={3}
                  value={user.userSummary}
                  onChange={changePerson}
                />
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <Button className="my-3" type="submit">
                  Submit
                </Button>
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <button
                  className="my-3 link-button"
                  type="submit"
                  onClick={() => history.push("/login")}
                >
                  Already registered? Click here to login
                </button>
              </Form.Group>
            </Form>
            <div className="col-md-8 mx-auto my-3 text-danger">
              <div>{validations.backendError.message}</div>
              <div>{validations.backendError.details}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Register);
