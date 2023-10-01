import { baseURI } from "../../util/api-config";
import * as cookie from 'react-cookies';
import { ApiMessageResponse, AuthRequest, ResponseObject, User, UserProxy } from "./service.model";

export const loginUser = async (creds: AuthRequest): Promise<ResponseObject<UserProxy>> => {

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...creds }),
  };
  try {

    const response = await fetch(`${baseURI}/public/login`, requestOptions);
    if (response.status === 200) {
      const currentUser = await response.json();
      const jwt = response.headers.get("Authorization") as string;

      let expires = new Date();
      expires.setDate(expires.getDate() + 7);

      cookie.save("jwt", jwt, { path: "/", expires: expires });
      cookie.save("current_user", currentUser, {
        path: "/",
        expires: expires,
      });
      return { response: currentUser, error: null };
    }
    else {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    }
  } catch (error) {
    return { response: null, error: error };
  }

}

export const registerUser = async (user: User): Promise<ResponseObject<User>> => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user })
  };
  try {

    const response = await fetch(`${baseURI}/public/register`, requestOptions);
    if (response.status === 200) {
      const currentUser = await response.json();
      return { response: currentUser, error: null };
    }
    else {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    }
  }
  catch (error) {
    return { response: null, error: error };
  }
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

  const jwtToken = cookie.load("jwt");
  
  const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      };

  try {
    const response = await fetch(`${baseURI}/user/${id}`, requestOptions);
    if (response.status === 200) {
      const user = await response.json();
      return { response: user, error: null };
    }
    else {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    }
  } catch (error) {
    return { response: null, error: error };
  }
}

export const updateUser = async (user: User): Promise<ResponseObject<ApiMessageResponse>> => {
  const jwtToken = cookie.load('jwt');
  const loggedInUser = cookie.load("current_user");

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...user }),
  };
  try {
    const response = await fetch(`${baseURI}/user`, requestOptions);

    if (response.status === 200) {
      const apiMessageResponse = await response.json();
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
      return { response: apiMessageResponse, error: null };

    }

    else {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    }

  } catch (error) {
    return { response: null, error: error };
  }
}