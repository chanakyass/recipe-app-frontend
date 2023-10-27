import * as notificationActions from '../../store/notification/notificationActions';
import * as notificationSlice from '../../store/notification/notificationSlice';
import * as errorHandling from "../../util/error-handling";
import apiCallError from '../mocks/errors/apicallerror.json';

jest.mock('../../util/error-handling', () => ({
    ...jest.requireActual('../../util/error-handling'),
    __esModule: true,
    default: jest.fn(),
}))

describe('test notification actions', () => {

    const dispatch = jest.fn();
    const getState = jest.fn();

    it('test handleError adds error to state when error code is 401/403', async () => {
        const notification = {
            resourceId: 123,
            resourceType: 'RECIPE',
            error: { ...apiCallError, statusCode: 401 },
            action: 'MODIFY',
            id: '1234',
            errorType: 'VALIDATION'
        };
        const retValue = { payload: {}, type: 'notifications/errorAdded' as `${string}/${string}` };
        const errorAddedSpy = jest.spyOn(notificationSlice, 'errorAdded').mockReturnValue(retValue);
        const action = notificationActions.handleError(notification);
        await action(dispatch, getState, undefined);
        expect(errorAddedSpy).toHaveBeenCalledWith(notification);
        expect(dispatch).toHaveBeenCalledWith(retValue);
    });

    it('test handleError navigates to error page', async () => {
        const notification = {
            resourceId: 123,
            resourceType: 'RECIPE',
            error: apiCallError,
            action: 'MODIFY',
            id: '1234',
            errorType: 'VALIDATION'
        };
        const navigateToErrorPageSpy = jest.spyOn(errorHandling, 'default');
        const action = notificationActions.handleError(notification);
        await action(dispatch, getState, undefined);
        expect(navigateToErrorPageSpy).toHaveBeenCalledWith({ error: notification.error });
    });

    it('test handleNotification calls notificationAdded', async () => {
        const notification = {
            resourceId: 123,
            resourceType: 'RECIPE',
            action: 'MODIFY',
            id: '1234',
            errorType: 'VALIDATION',
            message: 'Success',
        };
        const retValue = { payload: {}, type: 'notifications/notificationAdded' as `${string}/${string}` };
        const notificationAddedSpy = jest.spyOn(notificationSlice, 'notificationAdded').mockReturnValue(retValue);
        const action = notificationActions.handleNotification(notification);
        await action(dispatch, getState, undefined);
        expect(notificationAddedSpy).toHaveBeenCalledWith(notification);
        expect(dispatch).toHaveBeenCalledWith(retValue);
    });
});