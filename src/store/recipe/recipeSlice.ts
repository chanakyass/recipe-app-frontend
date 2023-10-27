import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { Recipe, ResourceState } from "../store.model";

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
        setRecipeLoading(state, action) {
            const { payload: loading } = action;
            state.loading = loading;
        }
    },
});

export const { recipeAdded, recipeListAdded, recipeModified, recipeDeleted, setRecipeLoading } = recipeSlice.actions;

 export default recipeSlice.reducer;