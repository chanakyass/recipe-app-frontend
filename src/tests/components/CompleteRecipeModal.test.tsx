import * as React from 'react'
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils'

import { render, screen, fireEvent, act } from '@testing-library/react';
import * as cookieUtil from 'react-cookies';
import App from '../../App';
import * as services from '../../services';
import { Recipe } from '../../services';
import mockUserRes from '../mocks/users/mockUserRes.json';
import mockGetRecipes from '../mocks/recipes/mockGetRecipesRes.json';
import { ThunkResponse } from '../../store/store.model';
import { preloadedState } from '../mocks/store/store.mocks';
import * as recipeActions from '../../store/recipe/recipeActions';

const storeMock = jest.requireActual('../../store/setup');


beforeEach(() => {
  jest.spyOn(cookieUtil, 'load').mockImplementation(() => '123');
  jest.spyOn(services.userApi, 'getUser').mockResolvedValue({ response: mockUserRes, error: null });
  jest.spyOn(services.recipeApi, 'getRecipes').mockResolvedValue({ response: mockGetRecipes as Recipe[], error: null });
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
});

test('renders complete recipe modal, modify and delete are not available if recipe doesnt belong to user', async () => {
  const { unmount } = renderWithProviders(<App/>, { preloadedState });
  const recipeCards = await screen.findAllByTestId('recipe-card', { exact: false });
  fireEvent(recipeCards[0], new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }));
  const completeRecipeModal = await screen.findByTestId('complete-recipe-modal-3160');
  expect(completeRecipeModal).toBeDefined();
  const deleteButton = screen.queryByTestId('deleteRecipeButton');
  const modifyButton = screen.queryByTestId('modifyRecipeButton');
  expect(deleteButton).toBe(null);
  expect(modifyButton).toBe(null);
  unmount();
});

test('renders complete recipe modal, modify and delete are available if recipe belong to user', async () => {
  const { unmount } = renderWithProviders(<App/>, { preloadedState });
  const recipeCard = await screen.findByTestId('recipe-card-11503');
  fireEvent(recipeCard, new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }));
  const completeRecipeModal = await screen.findByTestId('complete-recipe-modal-11503');
  expect(completeRecipeModal).toBeDefined();
  const deleteButton = await screen.findByTestId('deleteRecipeButton');
  const modifyButton = await screen.findByTestId('modifyRecipeButton');
  expect(deleteButton).toBeDefined();
  expect(modifyButton).toBeDefined();
  unmount();
});

test('Delete recipe', async () => {
  const { store: mockStore, unmount } = renderWithProviders(<App/>, { preloadedState });
  const recipeCard = await screen.findByTestId('recipe-card-11503');
  fireEvent(recipeCard, new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }));
  await act(async () => {
    const deleteButton = await screen.findByTestId('deleteRecipeButton');
    jest.spyOn(mockStore, 'dispatch').mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(ThunkResponse.SUCCESS)
    });
    const thunkActionMock = jest.fn();
    jest.spyOn(recipeActions, 'deleteRecipe').mockReturnValue(thunkActionMock);
    fireEvent(deleteButton!, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    expect(deleteButton).toBeDefined();
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(2, thunkActionMock);
  });
  unmount();
});
