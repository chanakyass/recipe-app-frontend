import { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { userApi } from "../services";
import { ThunkResponse, User, useAppDispatch, useErrorSelector } from "../store/store.model";
import { loginUser, registerUser } from "../store/user";
import UserForm from "./UserForm";

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
  statusCode: 0,
  message: "",
  timestamp: "",
  details: [] as string[],
},
};

const Register = () => {

const history = useHistory();

const [validations, setValidations] = useState(defaultValidations);

const dispatch = useAppDispatch();

const errorInRegistration = useErrorSelector((state) => (
  state.notifications.errors.find((error) => error.resourceType === 'user' && error.action === 'REGISTER')
));

useEffect(() => {
  if (errorInRegistration?.errorType === 'VALIDATION') {
    setValidations((validations) => ({
      ...validations,
      hasError: true,
      backendError: errorInRegistration.error!
    }));
  }
}, [setValidations, errorInRegistration]);

  const submitHandler = async (e: any, user: User) => {
      e.preventDefault();
      const fieldErrors = { ...defaultValidations.fieldErrors };
      if (userApi.isValid(user, fieldErrors, "POST")) {
        const thunkResponse = await dispatch(registerUser(user)).unwrap();
        if (thunkResponse === ThunkResponse.SUCCESS) {
          dispatch(loginUser({ username: user.email, password: user.password! })).unwrap().then((thunkResponse) => {
            if (thunkResponse === ThunkResponse.SUCCESS) {
              history.push('/');
            } else {
              history.push('/login');
            }
          });
        }
      } else {
        setValidations({ ...defaultValidations, fieldErrors: fieldErrors, hasError: true });
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
            <UserForm submitHandler={submitHandler} validations={validations} userFormType="REGISTER" />
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Register);
