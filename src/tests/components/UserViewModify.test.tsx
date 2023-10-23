// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils';

import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import * as routerComps from 'react-router-dom';
import * as routerDom from 'react-router-dom';
import history from '../../app-history';
import UserViewModify from '../../components/UserViewModify';
import { setupConfiguredStore } from '../../store/setup';
import * as userActions from '../../store/user/userActions';
import { preloadedState } from '../mocks/store/store.mocks';
import { ThunkResponse } from '../../store/store.model';

const storeMock = jest.requireActual('../../store/setup');
const mockedHistory = {
    ...history,
    push: jest.fn(),
};

const store = setupConfiguredStore(preloadedState);

jest.mock('react-router-dom', () => ({
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
}));

beforeEach(() => {
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
  jest.spyOn(routerComps, 'useHistory').mockReturnValue(mockedHistory as any);
});

test('render UserViewModify and check if modify user button is not enabled when user is not logged in user', async () => {
  jest.spyOn(routerDom, 'useParams').mockImplementation(() => ({ id: '8253' }));
  const fn1 = jest.fn().mockReturnValue('getUser');
  jest.spyOn(userActions, 'getUser').mockReturnValue(fn1);
  const mockDispatch = jest.spyOn(store, 'dispatch').mockReturnValue({
    unwrap: jest.fn().mockResolvedValue({ ...preloadedState.users.loggedInUser, id: 8253 })
  });
  await act(async () => {
    const { unmount } = renderWithProviders(<UserViewModify loadingStatus={false} />, { preloadedState, store }, mockDispatch);
    await waitFor(() => {
        const setModifyUserButton = screen.queryByTestId('set-modify-user');
        expect(setModifyUserButton).toBeNull();
        unmount();
    });
  });
});

test('render UserViewModify and check if modify user button is enabled when user is logged in user', async () => {
    jest.spyOn(routerDom, 'useParams').mockImplementation(() => ({ id: '8252' }));
    const fn1 = jest.fn().mockReturnValue('getUser');
    jest.spyOn(userActions, 'getUser').mockReturnValue(fn1);
    await act(async () => {
      const { unmount } = renderWithProviders(<UserViewModify loadingStatus={false} />, { preloadedState });
      await waitFor(() => {
          const setModifyUserButton = screen.queryByTestId('set-modify-user');
          expect(setModifyUserButton).not.toBeNull();
          unmount();
      });
    });
});

test('render UserViewModify and check if logged in user able to modify', async () => {
    jest.spyOn(routerDom, 'useParams').mockImplementation(() => ({ id: '8252' }));
    const fn1 = jest.fn().mockReturnValue('getUser');
    const fn2 = jest.fn().mockReturnValue('modifyUser');
    jest.spyOn(userActions, 'getUser').mockImplementation(fn1);
    const modifyUserSpy = jest.spyOn(userActions, 'modifyUser').mockImplementation(fn2);
    await act(async () => {
      const { store: mockStore, unmount } = renderWithProviders(<UserViewModify loadingStatus={false} />, { preloadedState });
      jest.spyOn(mockStore, 'dispatch').mockImplementation((arg) => {
        if (arg === fn1()) {
            return {
                unwrap: jest.fn().mockResolvedValue(preloadedState.users.loggedInUser)
            };
        }
        return {
            unwrap: jest.fn().mockResolvedValue(ThunkResponse.SUCCESS)
        }
      });
      const setModifyUserButton = await screen.findByTestId('set-modify-user');
      fireEvent.click(setModifyUserButton);
      const profileName = await screen.findByTestId('profileName');
      fireEvent.change(profileName, {
        target: {
            name: 'profileName',
            value: 'Changed profile name',
        }
      });
      const submit = await screen.findByTestId('submit');
      fireEvent.click(submit);
      await waitFor(async () => {
        expect(modifyUserSpy).toHaveBeenCalledWith({
            ...preloadedState.users.loggedInUser, profileName: 'Changed profile name',
        });
        expect(mockedHistory.push).toHaveBeenCalled();
        unmount();
      })
    });
});

