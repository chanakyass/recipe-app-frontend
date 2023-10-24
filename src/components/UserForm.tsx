import {
    useState,
  } from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import {  User, defaultUser } from "../store/store.model";
import { useHistory } from "react-router";

type submitHandlerType = (e: any, user: User) => void;

type UserFormParamsType = { submitHandler: submitHandlerType, validations: any, userFormType: string, userToLoad?: User };

const UserForm = ({ submitHandler, validations, userFormType, userToLoad }: UserFormParamsType) => {

    const [user, setUser] = useState(userToLoad ?? defaultUser);

    const history = useHistory();

    const changePerson = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;
        const newUser = {
          ...user,
          [name]: value,
        };
        setUser(newUser);
    };

    return <>
        <Form noValidate onSubmit={(e) => submitHandler(e, user)}>
            <div className="col-md-12 col-sm-12 col-lg-12 my-4 mx-auto">
              <h5>{ userFormType === 'MODIFY' ? 'User details': 'Register' }</h5>
            </div>

            <Form.Group as={Col} md={12}>
            {/* <Form.Label>Name</Form.Label> */}
            <InputGroup className="flex-nowrap">
                <InputGroup.Append>
                <Form.Control
                id="firstName"
                name="firstName"
                data-testid="firstName"
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
                </InputGroup.Append>

                <InputGroup.Append>
                <Form.Control
                    id="middleName"
                    name="middleName"
                    data-testid="middleName"
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
                    data-testid="lastName"
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

            <Form.Group as={Col} md={12}>
            <Form.Label className="h5">Email address:</Form.Label>

            <Form.Control
                id="email"
                name="email"
                type="email"
                data-testid="email"
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

            <Form.Group as={Col} md={12}>
            <Form.Label>Profile Name</Form.Label>

            <Form.Control
                id="profileName"
                name="profileName"
                data-testid="profileName"
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

            {userFormType !== 'MODIFY' &&
            <Form.Group as={Col} md={12}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  data-testid="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={user.password}
                  onChange={changePerson}
                  isInvalid={
                    validations.hasError &&
                    !!validations.fieldErrors.passwordError
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validations.fieldErrors.passwordError}
                </Form.Control.Feedback>
            </Form.Group>
            }

            <Form.Group as={Col} md={12}>
            <Form.Label>Date of Birth</Form.Label>

            <Form.Control
                id="dob"
                name="dob"
                data-testid="dob"
                type="date"
                value={
                user.dob
                    ? new Date(user.dob).toISOString().slice(0, 10)
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

            <Form.Group as={Col} md={12}>
            <Form.Label>Something about yourself</Form.Label>

            <Form.Control
                id="userSummary"
                name="userSummary"
                data-testid="userSummary"
                as="textarea"
                rows={3}
                value={user.userSummary}
                onChange={changePerson}
            />
            </Form.Group>

            {userFormType === 'MODIFY' ?
            <Form.Group as={Col} md={12}>
                <Button
                    className="my-3 mr-2"
                    data-testid="submit"
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
            </Form.Group> :
            <>
              <Form.Group as={Col} md={12}>
                <Button className="my-3" type="submit" data-testid="submit">
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
            </>
            }
        </Form>
        <div>
            {validations.hasError && validations.backendError.message}
        </div>
        <div>
            {validations.hasError && validations.backendError.details}
        </div>
    </>
}

export default UserForm;