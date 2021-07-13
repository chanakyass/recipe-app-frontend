import { baseURI } from "../../util/api-config";
import cookie from 'react-cookies';
import moment from "moment";

export const fetchIngredientsStartingWith = async (name) => {
  const jwtToken = cookie.load("jwt");
    const requestOptions = {
        method: "GET",
        headers: {
        "Authorization": `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
        }
       
  };
  try {
    const response = await fetch(
      `${baseURI}/ingredients?startsWith=${name}`,
      requestOptions
    );

    if (response.status !== 200) {
      const apiCallError = response.json();
      return { response: null, error: apiCallError };
    }

    else {
      const ingredientsList = await response.json();
      return { response: ingredientsList, error: null };
    }
  }
  catch (error) {
    return { response: null, error: error };
  }
}

export const addOrModifyRecipe = async (recipe, mode) => {
  const jwtToken = cookie.load("jwt");
  let body = null;
  if (mode !== "MODIFY") {
    body = JSON.stringify({ ...recipe, createdOn: moment.utc().toISOString() });
  }
  else {
    body = JSON.stringify({...recipe})
  }

      const requestOptions = {
        method: mode === "MODIFY" ? "PUT": "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: body,
  };
  try {

    const response = await fetch(`${baseURI}/recipe`, requestOptions);
    if (response.status !== 200) {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    } else {
      const apiMessageResponse = await response.json();
      return { response: apiMessageResponse, error: null };
         
    }
  }
  catch (error) {
    return { response: null, error: error };
  }

}

export const getRecipes = async () => {
  const jwtToken = cookie.load("jwt");
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${baseURI}/recipes`, requestOptions);

    if (response.status === 200) {
      const recipes = await response.json();
      return { response: recipes, error: null };
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

export const getRecipe = async (id) => {
    const jwtToken = cookie.load("jwt");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
  };
  try {
    const response = await fetch(`${baseURI}/recipe/${id}`, requestOptions);

    if (response.status === 200) {
      const recipe = await response.json();
      return { response: recipe, error: null };
    } else {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    }
  }
  catch (error) {
    return { response: null, error: error };
  }
}

export const deleteRecipe = async (id) => {
  const jwtToken = cookie.load("jwt");
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${baseURI}/recipe/${id}`, requestOptions);

    if (response.status === 200) {
      const apiMessageResponse = await response.json();
      return { response: apiMessageResponse, error: null };
    } else {
      const apiCallError = await response.json();
      return { response: null, error: apiCallError };
    }
  }
  catch (error) {
    return { response: null, error: error };
  }
}