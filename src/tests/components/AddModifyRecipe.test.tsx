// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as routerComps from 'react-router-dom';
import * as routerDom from 'react-router-dom';
import AddModifyRecipe from '../../components/AddModifyRecipe';
import * as recipeActions from '../../store/recipe/recipeActions';
import { setupConfiguredStore } from '../../store/setup';
import { ThunkResponse } from '../../store/store.model';
import { preloadedState } from '../mocks/store/store.mocks';
import * as utilities from '../../util/utility-functions';

const storeMock = jest.requireActual('../../store/setup');

const mockedHistory = {
    ...history,
    push: jest.fn(),
};

jest.mock('react-router-dom', () => {
    return {
      __esModule: true,
      ...jest.requireActual('react-router-dom')
    };
});


beforeEach(() => {
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
  jest.spyOn(routerComps, 'useHistory').mockReturnValue(mockedHistory as any);
  jest.spyOn(utilities, 'debounced').mockImplementation((arg1, _arg2, ...arg3) => arg1(arg3));
});

test('Test add recipe', async () => {
    const fn1 = jest.fn().mockReturnValue('fetchIngredientsStartingWithName');
    const fn2 = jest.fn().mockReturnValue('addRecipeSpy');

    jest.spyOn(recipeActions, 'fetchIngredientsStartingWithName').mockImplementation(fn1);
    jest.spyOn(recipeActions, 'addRecipe').mockImplementation(fn2);
    jest.spyOn(routerDom, 'useParams').mockImplementation(() => ({ id: 'new' }));
  
    const { unmount, store: mockStore } = renderWithProviders(<AddModifyRecipe/>, { preloadedState });
  
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch').mockImplementation((arg) => {
      if(arg === fn1()) {
          return {
              unwrap: jest.fn().mockResolvedValueOnce([
                  {
                      id: 123,
                      name: 'Chicken'
                  }                
              ])
          };
      } else {
          return {
              unwrap: jest.fn().mockResolvedValueOnce(ThunkResponse.SUCCESS)
          };
      }
    });
  
    const addModifyRecipeModal = await screen.findByTestId('add-modify-recipe');
    expect(addModifyRecipeModal).toBeDefined();
  
    const recipeNameTextbox = await screen.findByTestId('name');
    fireEvent.change(recipeNameTextbox, {
      target: {
          name: 'name',
          value: 'Test Recipe',
      }
    });
  
    const recipeDesp = await screen.findByTestId('description');
    fireEvent.change(recipeDesp, {
      target: {
          name: 'description',
          value: 'Test description',
      }
    });
  
    const recipeItemType = await screen.findByTestId('itemType-1');
    fireEvent.change(recipeItemType, {
      target: {
          name: 'itemType-1',
          value: 'VEG',
      }
    });
  
    const serving = await screen.findByTestId('serving');
    fireEvent.change(serving, {
      target: {
          name: 'serving',
          value: '4',
      }
    });
  
    const addIngredient = await screen.findByTestId('add-ingredient');
    fireEvent.click(addIngredient);
  
    const recipeIngredientNames = await screen.findAllByTestId(new RegExp(/recipeIngredient_.*_name/, 'i'));
    fireEvent.change(recipeIngredientNames[0], {
      target: {
          name: recipeIngredientNames[0].getAttribute('id'),
          value: 'Chicken',
      }
    });
  
    const recipeIngredientQuantities = await screen.findAllByTestId(new RegExp(/recipeIngredient_.*_quantity/, 'i'));
    fireEvent.change(recipeIngredientQuantities[0], {
      target: {
          name: recipeIngredientNames[0].getAttribute('id'),
          value: '12'
      }
    });
  
    const recipeIngredientUoms = await screen.findAllByTestId(new RegExp(/recipeIngredient_.*_uom/, 'i'));
    const options = recipeIngredientUoms[0].getElementsByTagName('option');
    fireEvent.select(options[0]);
  
    const cookingIns = await screen.findByTestId('cookingInstructions');
  
    fireEvent.change(cookingIns, {
      target: {
          name: 'cookingInstructions',
          value: 'Brief description',
      }
    });
  
    const submit = await screen.findByTestId('submit');
    fireEvent.click(submit);
  
    expect(dispatchSpy).toHaveBeenCalled();
    await waitFor(() => {
        expect(mockedHistory.push).toHaveBeenCalled();
        unmount();
    });
});

test('Test modify recipe', async () => {
    jest.useFakeTimers();
    const fn1 = jest.fn().mockReturnValue('fetchIngredientsStartingWithName');
    const fn2 = jest.fn().mockReturnValue('modifyRecipe');

    jest.spyOn(recipeActions, 'fetchIngredientsStartingWithName').mockImplementation(fn1);
    const modifyRecipeSpy = jest.spyOn(recipeActions, 'modifyRecipe').mockImplementation(fn2);
    jest.spyOn(routerDom, 'useParams').mockImplementation(() => ({ id: '11502' }));

    const mockStore = setupConfiguredStore(preloadedState);

    const dispatchSpy = jest.spyOn(mockStore, 'dispatch').mockImplementation((arg) => {
        if(arg === fn1()) {
            return {
                unwrap: jest.fn().mockResolvedValue([
                    {
                        id: 123,
                        name: 'Chicken'
                    }                
                ])
            };
        } else {
            return {
                unwrap: jest.fn().mockResolvedValue(ThunkResponse.SUCCESS)
            };
        }
    });
  
    const { unmount } = renderWithProviders(<AddModifyRecipe/>, { preloadedState, store: mockStore }, dispatchSpy);
  
    const addModifyRecipeModal = await screen.findByTestId('add-modify-recipe');
    expect(addModifyRecipeModal).toBeDefined();
  
    const removeIngredients = await screen.findAllByTestId('remove-ingredient');
    fireEvent.click(removeIngredients[0]);

    const submit = await screen.findByTestId('submit');
    fireEvent.click(submit);
  
    expect(dispatchSpy).toHaveBeenCalled();

    const recipeToModify = preloadedState.recipes.resourceMap[11502];

    expect(modifyRecipeSpy).toHaveBeenCalledWith({
        ...recipeToModify,
        recipeIngredients: recipeToModify.recipeIngredients.slice(1),
    });
    await waitFor(() => {
        expect(mockedHistory.push).toHaveBeenCalled();
        unmount();
    });
});