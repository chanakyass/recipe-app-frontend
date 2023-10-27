import * as recipeSlice from '../../store/recipe/recipeSlice';
import { setupConfiguredStore } from '../../store/setup';
import { preloadedState } from '../mocks/store/store.mocks';
import modRecipe from '../mocks/recipes/modifyMockRecipe.json';

describe('Test recipe slice methods', () => {
    const mockStore = setupConfiguredStore(preloadedState);

    it('recipeAdded test', () => {
        mockStore.dispatch(recipeSlice.recipeAdded({ ...modRecipe, id: 123 }));
        expect(mockStore.getState().recipes.resourceMap[123]).toMatchObject({ ...modRecipe, id: 123 });
    });

    it('recipeListAdded test', () => {
        mockStore.dispatch(recipeSlice.recipeListAdded([{ ...modRecipe, id: 345 }]));
        expect(mockStore.getState().recipes.resourceMap[345]).toMatchObject({ ...modRecipe, id: 345 });
    });

    it('recipeModified test', () => {
        mockStore.dispatch(recipeSlice.recipeModified({ ...modRecipe, id: 345, name: 'mod recipe' }));
        expect(mockStore.getState().recipes.resourceMap[345]).toMatchObject({ ...modRecipe, id: 345, name: 'mod recipe' });
    });

    it('recipeDeleted test', () => {
        mockStore.dispatch(recipeSlice.recipeDeleted(345));
        expect(mockStore.getState().recipes.resourceMap[345]).toBeUndefined();
    });

    it('recipeLoading test', () => {
        mockStore.dispatch(recipeSlice.setRecipeLoading(true));
        expect(mockStore.getState().recipes.loading).toBe(true);
    });
});