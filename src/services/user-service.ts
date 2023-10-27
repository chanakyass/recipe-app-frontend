import { baseURI } from "../util/api-config";
import * as cookie from 'react-cookies';
import { ApiMessageResponse, AuthRequest, ResponseObject, User, UserProxy } from "./service.model";
import { callEndpointAndHandleResult } from "./utils";

export const loginUser = async (creds: AuthRequest): Promise<ResponseObject<UserProxy>> => {
  const body = JSON.stringify({ ...creds });
  const responseObj = await callEndpointAndHandleResult<ResponseObject<UserProxy>>(`${baseURI}/public/login`, 'POST', body, true, true);
  if (!responseObj.error) {
    const jwt = responseObj.token as string;
    let expires = new Date();
    expires.setDate(expires.getDate() + 7);

    cookie.save("jwt", jwt, { path: "/", expires: expires });
    cookie.save("current_user", responseObj.response!, {
      path: "/",
      expires: expires,
    }); 
  }
  return { response: responseObj.response, error: responseObj.error };
}

export const registerUser = async (user: User): Promise<ResponseObject<User>> => {
  return callEndpointAndHandleResult(`${baseURI}/public/register`, 'POST', JSON.stringify({ ...user }), true);
}

export const isValid = (user: User, fieldErrors: { [key: string]: string }, method: string): boolean => {
  let returnValue = true;

  if (user.firstName === "") {
    fieldErrors.firstNameError = "Field can't be empty";
    returnValue = false;
  }
    
    if (user.lastName === "") {
      fieldErrors.lastNameError = "Field can't be empty";
      returnValue = false;
  }
  

  if (user.profileName === "") {
    fieldErrors.profileNameError = "Field can't be empty";
    returnValue = false;
  }

  if (method === "POST") {
    if (user.email === "") {
      fieldErrors.emailError = "Field can't be empty";
      returnValue = false;
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(user.email).toLowerCase())) {
        fieldErrors.emailError = "Incorrect email format";
        returnValue = false;
      }
    }
  }
  // Also need a regex for email

  if (method === "POST") {
    if (user.password === "") {
      fieldErrors.passwordError = "Field can't be empty";
      returnValue = false;
    } else {
      const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (!re.test(String(user.password))) {
        fieldErrors.passwordError = "Incorrect password format";
        returnValue = false;
      }
    }
  }

  if (user.dob === "") {
    fieldErrors.DOBError = "Field can't be empty";
    returnValue = false;
  }
  
  return returnValue;
};

export const getUser = async (id: number): Promise<ResponseObject<User>> => {
  return callEndpointAndHandleResult(`${baseURI}/user/${id}`, 'GET'); 
}

export const updateUser = async (user: User): Promise<ResponseObject<ApiMessageResponse>> => {
  const loggedInUser = cookie.load("current_user");
  const responseObj = await callEndpointAndHandleResult<ResponseObject<ApiMessageResponse>>(`${baseURI}/user`, 'PUT', JSON.stringify({ ...user }));
  if (!responseObj.error) {
    const currentUser = {
      ...loggedInUser,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      userSummary: user.userSummary,
      profileName: user.profileName,
      dob: user.dob
    };

    let expires = new Date();
    expires.setDate(expires.getDate() + 7);

    cookie.save("current_user", currentUser, {
      path: "/",
      expires: expires,
    });
  }
  return responseObj;
}