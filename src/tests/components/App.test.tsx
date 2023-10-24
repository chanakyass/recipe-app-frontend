// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils';

import { screen } from '@testing-library/react';
import * as cookieUtil from 'react-cookies';
import App from '../../App';
import * as services from '../../services';
import { Recipe } from '../../services';
import mockGetRecipes from '../mocks/recipes/mockGetRecipesRes.json';
import mockUserRes from '../mocks/users/mockUserRes.json';
import { preloadedState } from '../mocks/store/store.mocks';

const storeMock = jest.requireActual('../../store/setup');


beforeEach(() => {
  jest.spyOn(cookieUtil, 'load').mockImplementation(() => '123');
  jest.spyOn(services.userApi, 'getUser').mockResolvedValue({ response: mockUserRes, error: null });
  jest.spyOn(services.recipeApi, 'getRecipes').mockResolvedValue({ response: mockGetRecipes as Recipe[], error: null });
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
});

test('renders all recipes on overview screen', async () => {
  const { store: jestStore, unmount } = renderWithProviders(<App/>, { preloadedState });
  const elements = await screen.findAllByTestId('recipe-card', { exact: false });
  expect(elements.length).toBe(mockGetRecipes.length);
  expect(jestStore.dispatch).toHaveBeenCalled();
  unmount();
});

