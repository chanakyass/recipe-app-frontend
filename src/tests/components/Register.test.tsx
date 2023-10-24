// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as cookieUtil from 'react-cookies';
import { Route, Router } from 'react-router';
import * as routerComps from 'react-router-dom';
import history from '../../app-history';
import Register from '../../components/Register';
import * as services from '../../services';
import { Recipe } from '../../services';
import { ThunkResponse } from '../../store/store.model';
import * as userActions from '../../store/user/userActions';
import mockGetRecipes from '../mocks/recipes/mockGetRecipesRes.json';
import { preloadedState } from '../mocks/store/store.mocks';
import mockUserRes from '../mocks/users/mockUserRes.json';

const storeMock = jest.requireActual('../../store/setup');
const mockedHistory = {
    ...history,
    push: jest.fn(),
};

jest.mock('react-router-dom', () => ({
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
}));

beforeEach(() => {
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
  jest.spyOn(routerComps, 'useHistory').mockReturnValue(mockedHistory as any);
});

test('render register screen and check register flow goes through successfully', async () => {
  const fn1 = jest.fn().mockReturnValue('registerUser');
  const fn2 = jest.fn().mockReturnValue('loginUser');
  const registerUserSpy = jest.spyOn(userActions, 'registerUser').mockReturnValue(fn1);
  jest.spyOn(userActions, 'loginUser').mockReturnValue(fn2);
  const { store: jestStore, unmount } = renderWithProviders(<Router history={history}><Route><Register/></Route></Router>, { preloadedState });
  jest.spyOn(jestStore, 'dispatch').mockReturnValue({
    unwrap: jest.fn().mockResolvedValue(ThunkResponse.SUCCESS)
  });
  const firstName = await screen.findByTestId('firstName');
  fireEvent.change(firstName, {
    target: {
        name: 'firstName',
        value: 'chanakya',
    }
  });

  const middleName = await screen.findByTestId('middleName');
  fireEvent.change(middleName, {
    target: {
        name: 'middleName',
        value: '',
    }
  });

  const lastName = await screen.findByTestId('lastName');
  fireEvent.change(lastName, {
    target: {
        name: 'lastName',
        value: 'sunkarapally',
    }
  });

  const email = await screen.findByTestId('email');
  fireEvent.change(email, {
    target: {
        name: 'email',
        value: 'chan@rest.com',
    }
  });

  const profileName = await screen.findByTestId('profileName');
  fireEvent.change(profileName, {
    target: {
        name: 'profileName',
        value: 'chan97',
    }
  });

  const dob = await screen.findByTestId('dob');
  fireEvent.change(dob, {
    target: {
        name: 'dob',
        value: '1995-06-10',
    }
  });

  const password = await screen.findByTestId('password');
  fireEvent.change(password, {
    target: {
        name: 'password',
        value: 'chan@123',
    }
  });

  const submit = await screen.findByTestId('submit');
  fireEvent.click(submit);

  await waitFor(() => {
    expect(registerUserSpy).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'chanakya',
        lastName: 'sunkarapally',
        email: 'chan@rest.com',
        profileName: 'chan97',
        dob: '1995-06-10',
        password: 'chan@123'
    }));
    expect(mockedHistory.push).toHaveBeenCalled();
    unmount();
  });
});

test('render register screen and check register flow when validation errors thrown', async () => {
    const { unmount } = renderWithProviders(<Router history={history}><Route><Register/></Route></Router>, { preloadedState });

    const firstName = await screen.findByTestId('firstName');
    fireEvent.change(firstName, {
      target: {
          name: 'firstName',
          value: 'chanakya',
      }
    });
  
    const email = await screen.findByTestId('email');
    fireEvent.change(email, {
      target: {
          name: 'email',
          value: 'chan@rest.com',
      }
    });
  
    const submit = await screen.findByTestId('submit');
    fireEvent.click(submit);
  
    await waitFor(() => {
      expect(mockedHistory.push).not.toHaveBeenCalled();
      unmount();
    });
  });

