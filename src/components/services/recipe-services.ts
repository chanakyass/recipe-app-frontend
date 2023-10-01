import { baseURI } from "../../util/api-config";
import * as cookie from 'react-cookies';
import * as moment from "moment";
import { APICallError, ApiMessageResponse, Ingredient, Recipe, ResponseObject } from "./service.model";

export const fetchIngredientsStartingWith = async (name: string): Promise<ResponseObject<Ingredient[]>> => {
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
      const apiCallError: APICallError = await response.json();
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

export const addOrModifyRecipe = async (recipe: Recipe, mode: string): Promise<ResponseObject<ApiMessageResponse>> => {
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

export const getRecipes = async (): Promise<ResponseObject<Recipe[]>> => {
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

export const getRecipe = async (id: number): Promise<ResponseObject<Recipe>> => {
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

export const deleteRecipe = async (id: number): Promise<ResponseObject<ApiMessageResponse>> => {
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