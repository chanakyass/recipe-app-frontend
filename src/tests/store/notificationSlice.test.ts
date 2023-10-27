import * as notificationSlice from '../../store/notification/notificationSlice';
import { setupConfiguredStore } from '../../store/setup';
import { preloadedState } from '../mocks/store/store.mocks';

describe('Test notification slice methods', () => {
    const mockStore = setupConfiguredStore(preloadedState);

    it('errorAdded test', () => {
        mockStore.dispatch(notificationSlice.errorAdded({ error: { message: 'Failed' } }));
        expect(mockStore.getState().notifications.errors[0]).toEqual(expect.objectContaining({ error: { message: 'Failed' } }));
    });

    it('notificationAdded test', () => {
        mockStore.dispatch(notificationSlice.notificationAdded({ message: 'Failed' }));
        expect(mockStore.getState().notifications.notifications[0]).toEqual(expect.objectContaining({ message: 'Failed' }));
    });

    it('notificationRemoved test', () => {
        mockStore.dispatch(notificationSlice.notificationRemoved({}));
        expect(mockStore.getState().notifications.notifications.length).toBe(0);
    });

    it('setCurrentNotificationMessage test', () => {
        mockStore.dispatch(notificationSlice.setCurrentNotificationMessage('There is an error'));
        expect(mockStore.getState().notifications.currentNotificationMessage).toBe('There is an error');
    });

    it('setTriggerNotification test', () => {
        mockStore.dispatch(notificationSlice.setTriggerNotification(true));
        expect(mockStore.getState().notifications.triggerNotification).toBe(true);
    });
});