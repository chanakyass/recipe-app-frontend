import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { userApi } from "../services";
import { APICallError, ThunkResponse, User, defaultUser, useAppDispatch, useErrorSelector, useUserSelector } from "../store/store.model";
import { getUser, modifyUser as modifyUserService } from "../store/user";
import withLoading from "./LoadingPage";
import UserForm from "./UserForm";
  
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

  const history = useHistory();

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
    if (id && loggedInUser.id && (id.toString() !== loggedInUser.id.toString())) {
      dispatch(getUser({id: parseInt(id), setLoggedInUser: false })).unwrap().then((user) => {
        if (user) {
          setUser(user);
        }
      });
    } else {
      setUser(loggedInUser);
      setIsLoggedInUser(true);
    }
  }, [loggedInUser, id, dispatch, setUser, setIsLoggedInUser]);

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

  const updateHandler = (e: any, user: User) => {
    e.preventDefault();

    const fieldErrors = {
      idError: "",
      nameError: "",
      profileNameError: "",
      emailError: "",
      DOBError: "",
      userSummaryError: "",
    };

    if (userApi.isValid(user, fieldErrors, "PUT")) {
      dispatch(modifyUserService(user)).unwrap().then((thunkResponse) => {
        if (thunkResponse === ThunkResponse.SUCCESS) {
          history.push('/');
        }
      });
    } else {
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
                        data-testid="set-modify-user"
                        className="mx-auto link-button"
                        onClick={(e) => setModifyUser(true)}
                      >Modify</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <UserForm submitHandler={updateHandler} validations={validations} userFormType="MODIFY" userToLoad={user}/>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withLoading(UserViewModify);
