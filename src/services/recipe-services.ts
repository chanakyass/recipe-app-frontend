import { baseURI } from "../util/api-config";
import moment from "moment";
import { APICallError, ApiMessageResponse, Ingredient, Recipe, ResponseObject } from "./service.model";
import storageApi from "../storage";
import { v4 } from "uuid";
import { callEndpointAndHandleResult } from "./utils";

export const fetchIngredientsStartingWith = async (name: string): Promise<ResponseObject<Ingredient[]>> => {
  const uri = `${baseURI}/ingredients?startsWith=${name}`;
  return callEndpointAndHandleResult(uri, 'GET');
}

export const addOrModifyRecipe = async (recipe: Recipe, mode: string): Promise<ResponseObject<ApiMessageResponse>> => {
  let body = null;
  let url: string | null = null;
  if (recipe.image) {
    const { response, error }  = await storageApi.addImageToStorage(recipe.image, recipe.user.id, v4(), mode === 'MODIFY' ? recipe.recipeImageAddress: undefined);
    if (error) {
      return { response: null, error };
    }
    url = response;
  }
  const { image, ...recipeWithoutImage} = recipe;
  if (mode !== "MODIFY") {
    body = JSON.stringify({ ...recipeWithoutImage, recipeImageAddress: url || '', createdOn: moment.utc().toISOString() });
  }
  else {
    body = JSON.stringify({...recipeWithoutImage, recipeImageAddress: url || recipe.recipeImageAddress})
  }
  return callEndpointAndHandleResult(`${baseURI}/recipe`, mode === "MODIFY" ? "PUT": "POST", body);
}

export const getRecipes = async (): Promise<ResponseObject<Recipe[]>> => {
  return callEndpointAndHandleResult(`${baseURI}/recipes`, 'GET');
}

export const getRecipe = async (id: number): Promise<ResponseObject<Recipe>> => {
  return callEndpointAndHandleResult(`${baseURI}/recipe/${id}`, 'GET');
}

export const deleteRecipe = async (recipe: Recipe): Promise<ResponseObject<ApiMessageResponse>> => {
  try {
    if (recipe.recipeImageAddress) {
      const { error } = await storageApi.deleteImageFromStorage(recipe.recipeImageAddress);
      if (error) {
        throw error;
      }
    }
    return callEndpointAndHandleResult(`${baseURI}/recipe/${recipe.id}`, 'DELETE');
  }
  catch (error) {
    return { response: null, error: error as APICallError };
  }
}