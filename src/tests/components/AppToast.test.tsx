// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../test-utils';

import { screen, waitFor } from '@testing-library/react';
import AppToast from '../../components/AppToast';
import { handleNotification } from '../../store/notification';
import { preloadedState } from '../mocks/store/store.mocks';
import { setupConfiguredStore } from '../../store/setup';

const storeMock = jest.requireActual('../../store/setup');


beforeEach(() => {
  jest.spyOn(storeMock.default, 'getState').mockReturnValue(preloadedState);
});

test('renders Apptoast with notification', async () => {
  const mockStore = setupConfiguredStore(preloadedState);
  const { store: jestStore, unmount } = renderWithProviders(<AppToast/>, { store: mockStore, preloadedState }, mockStore.dispatch);
  await jestStore.dispatch(handleNotification({ message: 'Notification added' }));
  const element = await screen.findByTestId('toastMessage');
  await waitFor(() => {
    expect(element.innerHTML).toContain('Notification added');
    unmount();
  });
});


