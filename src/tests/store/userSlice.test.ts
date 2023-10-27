import * as userSlice from '../../store/user/userSlice';
import { setupConfiguredStore } from '../../store/setup';
import { preloadedState } from '../mocks/store/store.mocks';
import mockUser from '../mocks/users/mockUserRes.json';

describe('Test notification slice methods', () => {
    const mockStore = setupConfiguredStore(preloadedState);

    it('userAdded test', () => {
        mockStore.dispatch(userSlice.userAdded(mockUser));
        expect(mockStore.getState().users.loggedInUser).toEqual(expect.objectContaining(mockUser));
    });

    it('userModified test', () => {
        mockStore.dispatch(userSlice.userModified({ mockUser, profileName: 'user' }));
        expect(mockStore.getState().users.loggedInUser).toEqual(expect.objectContaining({ mockUser, profileName: 'user' }));
    });

    it('setUserLoading test', () => {
        mockStore.dispatch(userSlice.setUserLoading(true));
        expect(mockStore.getState().users.loading).toBe(true);
    });
});