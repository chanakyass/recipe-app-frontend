import * as recipeActions from "../../store/recipe/recipeActions";
import { preloadedState } from "../mocks/store/store.mocks";
import mockAddRecipe from '../mocks/recipes/mockAddRecipeReq.json'
import mockModifyRecipe from '../mocks/recipes/modifyMockRecipe.json'
import { Recipe, ThunkResponse } from "../../store/store.model";
import * as recipeApi from "../../services/recipe-services";
import * as recipeSlice from '../../store/recipe/recipeSlice';
import * as notificationActions from '../../store/notification/notificationActions';

describe('test Recipe actions', () => {

    const dispatch = jest.fn();
    const getState = jest.fn();

    it('test addRecipe updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(recipeApi, 'addOrModifyRecipe').mockImplementation(fn.mockResolvedValue({
            response: {
               generatedId: 1,
               message: 'Success' 
            },
            error: null
        }));
        const recipeAddedSpy = jest.spyOn(recipeSlice, 'recipeAdded');
        const handleNotificationSpy = jest.spyOn(notificationActions, 'handleNotification');
        const action = recipeActions.addRecipe(mockAddRecipe);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockAddRecipe, 'ADD');
        expect(recipeAddedSpy).toHaveBeenCalledWith({ ...mockAddRecipe, id: 1 });
        expect(handleNotificationSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceId: 1,
                message: 'Success'
            })
        );
        expect(response.payload).toBe(ThunkResponse.SUCCESS);
    });

    it('test addRecipe updates state on failure', async () => {
        const fn = jest.fn();
        const error = {
            statusCode: 500,
            URI: 'mock/xyz',
            message: 'Failed',
            timestamp: 'xyz',
            details: 'mock details'
        };
        jest.spyOn(recipeApi, 'addOrModifyRecipe').mockImplementation(fn.mockResolvedValue({
            response: null,
            error
        }));
        const handleErrorSpy = jest.spyOn(notificationActions, 'handleError');
        const action = recipeActions.addRecipe(mockAddRecipe);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockAddRecipe, 'ADD');
        expect(handleErrorSpy).toHaveBeenCalledWith(
            expect.objectContaining({ error })
        );
        expect(response.payload).toBe(ThunkResponse.FAILURE);
    });

    it('test modifyRecipe updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(recipeApi, 'addOrModifyRecipe').mockImplementation(fn.mockResolvedValue({
            response: {
               generatedId: 2,
               message: 'Success' 
            },
            error: null
        }));
        const recipeModifiedSpy = jest.spyOn(recipeSlice, 'recipeModified');
        const handleNotificationSpy = jest.spyOn(notificationActions, 'handleNotification');
        const action = recipeActions.modifyRecipe(mockModifyRecipe);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockModifyRecipe, 'MODIFY');
        expect(recipeModifiedSpy).toHaveBeenCalledWith(mockModifyRecipe);
        expect(handleNotificationSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceId: 2,
                message: 'Success'
            })
        );
        expect(response.payload).toBe(ThunkResponse.SUCCESS);
    });

    it('test modifyRecipe updates state on failure', async () => {
        const fn = jest.fn();
        const error = {
            statusCode: 500,
            URI: 'mock/xyz',
            message: 'Failed',
            timestamp: 'xyz',
            details: 'mock details'
        };
        jest.spyOn(recipeApi, 'addOrModifyRecipe').mockImplementation(fn.mockResolvedValue({
            response: null,
            error
        }));
        const handleErrorSpy = jest.spyOn(notificationActions, 'handleError');
        const action = recipeActions.modifyRecipe(mockModifyRecipe);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockModifyRecipe, 'MODIFY');
        expect(handleErrorSpy).toHaveBeenCalledWith(
            expect.objectContaining({ error })
        );
        expect(response.payload).toBe(ThunkResponse.FAILURE);
    });


    it('test deleteRecipe updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(recipeApi, 'deleteRecipe').mockImplementation(fn.mockResolvedValue({
            response: {
               message: 'Success' 
            },
            error: null
        }));
        const recipeDeletedSpy = jest.spyOn(recipeSlice, 'recipeDeleted');
        const handleNotificationSpy = jest.spyOn(notificationActions, 'handleNotification');
        const action = recipeActions.deleteRecipe(mockModifyRecipe);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockModifyRecipe);
        expect(recipeDeletedSpy).toHaveBeenCalledWith(mockModifyRecipe.id);
        expect(handleNotificationSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Success'
            })
        );
        expect(response.payload).toBe(ThunkResponse.SUCCESS);
    });

    it('test getRecipeList updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(recipeApi, 'getRecipes').mockImplementation(fn.mockResolvedValue({
            response: [{ id: 123, name: 'My recipe' }],
            error: null
        }));
        const recipeListAddedSpy = jest.spyOn(recipeSlice, 'recipeListAdded');
        const setRecipeLoadingSpy = jest.spyOn(recipeSlice, 'setRecipeLoading');
        const action = recipeActions.getRecipeList();
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalled();
        expect(recipeListAddedSpy).toHaveBeenCalledWith([{ id: 123, name: 'My recipe' }]);
        expect(setRecipeLoadingSpy).toHaveBeenCalled();
    });
});