// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as cookieUtil from 'react-cookies';
import { Route, Router } from 'react-router';
import * as routerComps from 'react-router-dom';
import history from '../../app-history';
import Login from '../../components/Login';
import { ThunkResponse } from '../../store/store.model';
import * as userActions from '../../store/user/userActions';
import { preloadedState } from '../mocks/store/store.mocks';

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
  jest.spyOn(cookieUtil, 'load').mockImplementation(() => '123');
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
  jest.spyOn(routerComps, 'useHistory').mockReturnValue(mockedHistory as any);
});

test('render login screen and check login flow', async () => {
  const fn1 = jest.fn().mockReturnValue('loginUser');
  jest.spyOn(userActions, 'loginUser').mockReturnValue(fn1);
  const { store: jestStore, unmount } = renderWithProviders(<Router history={history}><Route><Login/></Route></Router>, { preloadedState });
  jest.spyOn(jestStore, 'dispatch').mockReturnValue({
    unwrap: jest.fn().mockResolvedValue(ThunkResponse.SUCCESS)
  });
  const username = await screen.findByTestId('username');
  fireEvent.change(username, {
    target: {
        name: 'username',
        value: 'chanakyass',
    }
  });

  const password = await screen.findByTestId('password');
  fireEvent.change(password, {
    target: {
        name: 'password',
        value: 'pass',
    }
  });

  const submit = await screen.findByTestId('submit');
  fireEvent.click(submit);

  await waitFor(() => {
    expect(mockedHistory.push).toHaveBeenCalled();
    unmount();
  });
});

