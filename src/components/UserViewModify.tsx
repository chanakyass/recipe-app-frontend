import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import history from "../app-history";
import { APICallError, ThunkResponse, User, useAppDispatch, useErrorSelector, useUserSelector } from "../store/store.model";
import { getUser, modifyUser as modifyUserService } from "../store/userSlice";
import { isValid } from "./services/user-service";
import withLoading from "./LoadingPage";

const defaultUser = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  profileName: "",
  dob: "",
  userSummary: "",
} as User;
  
const defaultValidations = {
  hasError: false,
  fieldErrors: {
    idError: "",
    nameError: "",
    profileNameError: "",
    emailError: "",
    DOBError: "",
    userSummaryError: "",
  },
  backendError: {
    statusCode: 0,
    message: "",
    timestamp: "",
    details: [] as string[],
    URI: ''
  } as APICallError,
};

const UserViewModify = () => {

  const dispatch = useAppDispatch();

  const loggedInUser = useUserSelector((state) => state.users.loggedInUser);

  const errorInModify = useErrorSelector((state) => state.notifications.errors
    .find((error) => error.resourceType === 'user' && error.action === 'MODIFY' && error.errorType === 'VALIDATION'));

  const [modifyUser, setModifyUser] = useState(false);

  const [user, setUser] = useState(defaultUser);
  
  const [validations, setValidations] = useState(defaultValidations);

  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  const { id } = useParams<{ id: string }>();

  const loadUser = useCallback(() => {
    dispatch(getUser({id: parseInt(id), isLoggedInUser: false })).unwrap().then((user) => {
      if (user && user?.id === loggedInUser.id) {
        setIsLoggedInUser(true);
        setUser(user)
      }
    });
  }, [loggedInUser.id, id, dispatch]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (errorInModify && errorInModify.error) {
      setValidations({
        ...defaultValidations,
        hasError: true,
        backendError: errorInModify.error,
      });
    }
  }, [errorInModify])

  const changePerson = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    const newUser = {
      ...user,
      [name]: value,
    };
    setUser(newUser);
  };

  const updateHandler = (e: any) => {
    e.preventDefault();

    const fieldErrors = {
      idError: "",
      nameError: "",
      profileNameError: "",
      emailError: "",
      DOBError: "",
      userSummaryError: "",
    };

    if (isValid(user, fieldErrors, "PUT")) {
      dispatch(modifyUserService(user)).unwrap().then((thunkResponse) => {
        if (thunkResponse === ThunkResponse.SUCCESS) {
          history.push('/');
        }
      });
    }
    else {
      setValidations({
        ...defaultValidations,
        hasError: true,
        fieldErrors,
      });
    }
  };

  return (
    <>
      <div style={{ height: "80vh" }}>
        <div className="row h-100 m-0">
          <div className="col-md-4 col-lg-4 col-sm-4 mx-auto my-auto rounded shadow bg-white">
            {modifyUser === false ? (
              <div>
                <div className="container">
                  <div className="row my-2">
                    <div className="col-md-6">Name:</div>
                    <div className="col-md-6">
                      {user.firstName +
                        " " +
                        user.middleName +
                        " " +
                        user.lastName}
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="row my-2">
                    <div className="col-md-6">Email:</div>
                    <div className="col-md-6">{user.email}</div>
                  </div>
                </div>
                <div className="container">
                  <div className="row my-2">
                    <div className="col-md-6">Profile Name:</div>
                    <div className="col-md-6">{user.profileName}</div>
                  </div>
                </div>
                <div className="container">
                  <div className="row my-2">
                    <div className="col-md-6">Date of Birth:</div>
                    <div className="col-md-6">{user.dob}</div>
                  </div>
                </div>
                <div className="container">
                  <div className="row my-2">
                    <div className="col-md-6">Profile Summary:</div>
                    <div className="col-md-6">{user.userSummary}</div>
                  </div>
                </div>
                {isLoggedInUser === true && (
                  <div className="container">
                    <div className="row my-2">
                      <button
                        className="mx-auto link-button"
                        onClick={(e) => setModifyUser(true)}
                      >Modify</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Form noValidate onSubmit={updateHandler}>
                  <div className="col-md-12 col-sm-12 col-lg-12 my-4 mx-auto">
                    <h5>User details</h5>
                  </div>

                  <Form.Group as={Col} md={12} controlId="formName">
                    {/* <Form.Label>Name</Form.Label> */}
                    <InputGroup>
                      <Form.Control
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={user.firstName}
                        isInvalid={
                          validations.hasError &&
                          validations.fieldErrors.nameError !== ""
                        }
                        onChange={changePerson}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validations.fieldErrors.nameError}
                      </Form.Control.Feedback>

                      <InputGroup.Append>
                        <Form.Control
                          id="middleName"
                          name="middleName"
                          type="text"
                          placeholder="Enter middle name"
                          value={user.middleName}
                          isInvalid={
                            validations.hasError &&
                            validations.fieldErrors.nameError !== ""
                          }
                          onChange={changePerson}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validations.fieldErrors.nameError}
                        </Form.Control.Feedback>
                      </InputGroup.Append>
                      <InputGroup.Append>
                        <Form.Control
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Enter last name"
                          value={user.lastName}
                          isInvalid={
                            validations.hasError &&
                            validations.fieldErrors.nameError !== ""
                          }
                          onChange={changePerson}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validations.fieldErrors.nameError}
                        </Form.Control.Feedback>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md={12} controlId="formEmail">
                    <Form.Label className="h5">Email address:</Form.Label>

                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      value={user.email}
                      onChange={changePerson}
                      isInvalid={
                        validations.hasError &&
                        validations.fieldErrors.emailError !== ""
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
                      isInvalid={
                        validations.hasError &&
                        validations.fieldErrors.profileNameError !== ""
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      {validations.fieldErrors.profileNameError}
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
                        validations.hasError &&
                        validations.fieldErrors.DOBError !== ""
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
                    <Button
                      className="my-3 mr-2"
                      variant="secondary"
                      type="submit"
                    >
                      Update
                    </Button>
                    <Button
                      className="my-3 ml-2"
                      variant="secondary"
                      type="reset"
                    >
                      Clear
                    </Button>
                  </Form.Group>
                </Form>
                <div>
                  {validations.hasError && validations.backendError.message}
                </div>
                <div>
                  {validations.hasError && validations.backendError.details}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withLoading(UserViewModify);
