import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseObject, recipeApi } from "../../services";
import { handleError, handleNotification } from '../notification';
import { recipeDeleted, recipeModified, recipeAdded, setRecipeLoading, recipeListAdded } from "./recipeSlice";
import { Notification, Recipe, ThunkResponse } from "../store.model";


export const modifyRecipe = createAsyncThunk("recipes/modifyRecipe", async (recipe: Recipe, { dispatch }) => {
    const { response, error } = await recipeApi.addOrModifyRecipe(recipe, 'MODIFY');
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'MODIFY', resourceId: recipe.id };
    if (error) {
        dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        dispatch(recipeModified(recipe));
        dispatch(handleNotification({ ...notification, resourceId: response?.generatedId, message: response?.message } as Notification));
        return ThunkResponse.SUCCESS;
    }
});

export const deleteRecipe = createAsyncThunk("recipes/deleteRecipe", async (recipe: Recipe, { getState, dispatch }) => {
    const { response, error } = await recipeApi.deleteRecipe(recipe);
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'DELETE', resourceId: recipe.id };
    if (error) {
        dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        dispatch(recipeDeleted(recipe.id));
        dispatch(handleNotification({ resourceId: response?.generatedId, ...notification, message: response?.message }));
        return ThunkResponse.SUCCESS;
    }
});

export const fetchIngredientsStartingWithName = createAsyncThunk("recipes/fetchIngredientsStartingWith", async (ingredientName: string) => {
    const { response: ingredientList, error } = await recipeApi.fetchIngredientsStartingWith(ingredientName);
    if (!error) {
        return ingredientList;
    }
    return null;
});

export const getRecipeList = createAsyncThunk("recipes/getRecipes", async (_, { dispatch }) => {
    dispatch(setRecipeLoading(true));
    const { response: recipeList, error } = await recipeApi.getRecipes() as ResponseObject<Recipe[]>;
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'READ' };
    if (error) {
        dispatch(handleError({ ...notification, error }));
    } else {
        dispatch(recipeListAdded(recipeList));
    }
    dispatch(setRecipeLoading(false));
});

export const addRecipe = createAsyncThunk("recipes/addRecipe", async (recipe: Recipe, { dispatch }) => {
    const { response, error } = await recipeApi.addOrModifyRecipe(recipe, 'ADD');
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'CREATE' };
    if (error) {
        dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        const generatedRecipe = {
            ...recipe,
            id: response?.generatedId
        };
        dispatch(recipeAdded(generatedRecipe));
        dispatch(handleNotification({ resourceId: response?.generatedId, ...notification, message: response?.message }));
        return ThunkResponse.SUCCESS;
    }
});

