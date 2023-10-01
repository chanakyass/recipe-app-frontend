import { SliceCaseReducers, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as recipeApi from "../components/services/recipe-services";
import { ResponseObject } from "../components/services/service.model";
import { errorAdded, handleError, handleNotification, notificationAdded } from "./notificationSlice";
import { Notification, Recipe, ResourceState, ThunkResponse } from "./store.model";
import { v4 as uuidv4 } from 'uuid';

const recipeSlice = createSlice<ResourceState<Recipe>, SliceCaseReducers<ResourceState<Recipe>>, string>({
    name: 'recipes',
    initialState: {
      resourceMap: {},
      loading: false,
    },
    reducers: {
        recipeAdded(state, action) {
            const { payload: recipe } = action as { payload: Recipe, type: string };
            const id = recipe.id!;
            state.resourceMap[id] = { ...recipe };
        },
        recipeListAdded(state, action) {
            const { payload: recipeList } = action as { payload: Recipe[], type: string };
            recipeList.forEach((recipe) => {
                const id = recipe.id!;
                state.resourceMap[id] = {
                    ...recipe, 
                    recipeIngredients: recipe.recipeIngredients.map((re) => {
                        return {
                            ...re,
                            uuid: uuidv4(),
                        }
                    }),
                };
            });
        },
        recipeDeleted(state, action) {
            const { payload: recipeId } = action;
            delete state.resourceMap[recipeId];
        },
        recipeModified(state, action) {
            const { payload: modifiedRecipe } = action as { payload: Recipe, type: string };
            Object.assign(state.resourceMap[modifiedRecipe.id!], modifiedRecipe);
        },
        setLoading(state, action) {
            const { payload: loading } = action;
            state.loading = loading;
        }
    },
});

export const { recipeAdded, recipeListAdded, recipeModified, recipeDeleted, appendError, removeError, setLoading } = recipeSlice.actions;

export const getRecipeList = createAsyncThunk("recipes/getRecipes", async(_, { dispatch }) => {
    dispatch(setLoading(true));
    const { response: recipeList, error }  = await recipeApi.getRecipes() as ResponseObject<Recipe[]>;
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'READ' };
    if (error) {
        dispatch(handleError({...notification, error}));
    } else {
        dispatch(recipeListAdded(recipeList));
    }
    dispatch(setLoading(false));
});

export const addRecipe = createAsyncThunk("recipes/addRecipe", async(recipe: Recipe, { dispatch }) => {
    const { response, error }  = await recipeApi.addOrModifyRecipe(recipe, 'ADD');
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
        dispatch(handleNotification({ resourceId: response?.generatedId, ...notification, message: response?.message }));
        dispatch(handleNotification({ resourceId: response?.generatedId, ...notification, message: response?.message }));
        dispatch(handleNotification({ resourceId: response?.generatedId, ...notification, message: response?.message }));
        return ThunkResponse.SUCCESS;
    }
});

export const modifyRecipe = createAsyncThunk("recipes/modifyRecipe", async(recipe: Recipe, { dispatch }) => {
    const { response, error } = await recipeApi.addOrModifyRecipe(recipe, 'MODIFY');
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'MODIFY', resourceId: recipe.id };
    if (error) {
        dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        dispatch(recipeModified(recipe));
        dispatch(handleNotification({ ...notification, resourceId: response?.generatedId, message: response?.message } as Notification))
        return ThunkResponse.SUCCESS;
    }
});

export const deleteRecipe = createAsyncThunk("recipes/deleteRecipe", async (recipeId: number, { getState, dispatch }) => {
    const { response, error } = await recipeApi.deleteRecipe(recipeId);
    let notification: Partial<Notification> = { resourceType: 'recipe', action: 'DELETE', resourceId: recipeId };
    if (error) {
        dispatch(errorAdded({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        dispatch(recipeDeleted(recipeId));
        dispatch(notificationAdded({ ...notification, resourceId: recipeId, message: response?.message } as Notification));
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

 export default recipeSlice.reducer;