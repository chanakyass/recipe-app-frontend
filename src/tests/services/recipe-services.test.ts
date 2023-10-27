import { Recipe } from '../../services';
import * as recipeApi from '../../services/recipe-services';
import * as serviceUtils from '../../services/utils';
import * as storage from "../../storage/storage.service";
import recipe from '../mocks/recipes/mockAddRecipeReq.json';
import modRecipe from '../mocks/recipes/modifyMockRecipe.json';

jest.mock('moment', () => ({
    utc: () => ({ toISOString: () => 'xyz' })
}));

describe('test recipe service', () => {

    let callEndpointAndHandleResultSpy: jest.SpyInstance;

    beforeEach(() => {
        callEndpointAndHandleResultSpy = jest.spyOn(serviceUtils, 'callEndpointAndHandleResult').mockImplementation(jest.fn());
    })

    it('test fetchIngredientsStartingWith calls callEndpointAndHandleResult with uri', async () => {
        recipeApi.fetchIngredientsStartingWith('abc');
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith('http://localhost:8080/api/v1/ingredients?startsWith=abc', 'GET')
    });

    it('test addOrModifyRecipe calls callEndpointAndHandleResult with uri & addImageToStorage', async () => {
        const addImageToStorageSpy = jest.spyOn(storage, 'addImageToStorage').mockResolvedValue({ response: 'test-url', error: null });
        const modRecipe: Recipe = { ...recipe, image: new File(['abc'], 'abc') };
        const { image, ...recipeWithoutImage } = modRecipe;
        const jsonString = JSON.stringify({ ...recipeWithoutImage, createdOn: 'xyz',  recipeImageAddress: 'test-url'});
        await recipeApi.addOrModifyRecipe(modRecipe, 'ADD');
        expect(addImageToStorageSpy).toHaveBeenCalledWith(modRecipe.image, modRecipe.user.id, expect.any(String), undefined);
        expect(callEndpointAndHandleResultSpy)
            .toHaveBeenCalledWith(`http://localhost:8080/api/v1/recipe`, 'POST', jsonString);
    });

    it('test getRecipes & getRecipe calls callEndpointAndHandleResult with uri', async () => {
        await recipeApi.getRecipes();
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith(`http://localhost:8080/api/v1/recipes`, 'GET');

        await recipeApi.getRecipe(123);
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith(`http://localhost:8080/api/v1/recipe/123`, 'GET');
    });

    it('test deleteRecipe calls callEndpointAndHandleResult with uri & deleteImageFromStorage', async () => {
        const deleteImageFromStorageSpy = jest.spyOn(storage, 'deleteImageFromStorage').mockResolvedValue({ response: 'Success', error: null });
        await recipeApi.deleteRecipe(modRecipe);
        expect(deleteImageFromStorageSpy).toHaveBeenCalledWith(modRecipe.recipeImageAddress);
        expect(callEndpointAndHandleResultSpy).toHaveBeenCalledWith(`http://localhost:8080/api/v1/recipe/${modRecipe.id}`, 'DELETE');
    });
});