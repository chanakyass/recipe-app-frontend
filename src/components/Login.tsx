import history from "../app-history";
import { Col, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { ThunkResponse, useAppDispatch, useErrorSelector } from "../store/store.model";
import { loginUser } from "../store/userSlice";

const Login = () => {

    const dispatch = useAppDispatch();

    const errorInLogin = useErrorSelector((state) => state.notifications.errors.find((error) => error.resourceType === 'user'
      && error.action === 'LOGIN'));

    const [validations, setValidations] = useState({
        statusCode: 0,
        message: "",
        timestamp: "",
        details: [] as string[],
        URI: '',
    });

    useEffect(() => {
      if (errorInLogin?.errorType === 'VALIDATION') {
        setValidations(errorInLogin.error!);
      }
    }, [setValidations, errorInLogin])

    const [creds, setCreds] = useState({
        username: "",
        password: "",
    });

    const changeDefaults = (e: any) => {
      const name = e.target.name;
      const value = e.target.value;
      setCreds({ ...creds, [name]: value });
    };


    const submitHandler = async (e: any) => {
        e.preventDefault();
        try {
          const thunkResponse = await dispatch(loginUser(creds)).unwrap();
          if (thunkResponse === ThunkResponse.SUCCESS) {
            history.push('/');
          }
        } catch(error) {
          console.log(error);
        }
    }

    return (
      <>
        <div style={{ height: "80vh", maxHeight: "80vh" }}>
          <div className="row h-100 m-0">
            <div className="col-md-4 col-lg-4 col-sm-4 mx-auto my-auto rounded shadow bg-white ">
              <div className="col-md-12 col-sm-12 col-lg-12 mx-auto mt-3">
                <h3>Recipes App</h3>
              </div>
              <Form noValidate onSubmit={submitHandler}>
                <div className="col-md-12 col-sm-12 col-lg-12 my-4 mx-auto">
                  <h5>Login</h5>
                </div>

                <Form.Group as={Col} md={12}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    id="username"
                    name="username"
                    type="email"
                    placeholder="Enter the email id you logged in with"
                    autoComplete="email"
                    value={creds.username}
                    onChange={changeDefaults}
                  />
                </Form.Group>

                <Form.Group as={Col} md={12}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={creds.password}
                    onChange={changeDefaults}
                    autoComplete="current-password"
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
                    onClick={() => history.push("/register")}
                  >
                    Register yourself
                  </button>
                </Form.Group>
              </Form>
              <div className="col-md-8 mx-auto my-3 text-danger">
                <div>{validations.message}</div>
                <div>{validations.details}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default withRouter(Login);