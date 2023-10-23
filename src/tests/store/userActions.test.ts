import * as userApi from "../../services/user-service";
import * as notificationActions from '../../store/notification/notificationActions';
import { ThunkResponse } from "../../store/store.model";
import * as userActions from "../../store/user/userActions";
import * as userSlice from '../../store/user/userSlice';
import mockLoginReq from '../mocks/users/mockLoginReq.json';
import mockRegisterUser from '../mocks/users/mockRegisterUserReq.json';
import mockUser from '../mocks/users/mockUserRes.json';

describe('test user actions', () => {

    const dispatch = jest.fn();
    const getState = jest.fn();

    it('test registerUser updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(userApi, 'registerUser').mockImplementation(fn.mockResolvedValue({
            response: mockUser,
            error: null
        }));
        const userAddedSpy = jest.spyOn(userSlice, 'userAdded');
        const handleNotificationSpy = jest.spyOn(notificationActions, 'handleNotification');
        const action = userActions.registerUser(mockRegisterUser);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockRegisterUser);
        expect(userAddedSpy).toHaveBeenCalledWith(mockUser);
        expect(handleNotificationSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceId: mockUser.id,
                message: 'Sucessfully created your account. Taking you to the homepage.'
            })
        );
        expect(response.payload).toBe(ThunkResponse.SUCCESS);
    });

    it('test loginUser updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(userApi, 'loginUser').mockImplementation(fn.mockResolvedValue({
            response: mockUser,
            error: null
        }));
        const handleNotificationSpy = jest.spyOn(notificationActions, 'handleNotification');
        const action = userActions.loginUser(mockLoginReq);
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(mockLoginReq);
        expect(handleNotificationSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceId: mockUser.id,
                message: 'Login was successful'
            })
        );
        expect(response.payload).toBe(ThunkResponse.SUCCESS);
    });

    it('test modify user updates state when successful', async () => {
        const fn = jest.fn();
        jest.spyOn(userApi, 'updateUser').mockImplementation(fn.mockResolvedValue({
            response: {
               generatedId: mockUser.id,
               message: 'Success' 
            },
            error: null
        }));
        const userModifiedSpy = jest.spyOn(userSlice, 'userModified');
        const handleNotificationSpy = jest.spyOn(notificationActions, 'handleNotification');
        const action = userActions.modifyUser({ ...mockUser, profileName: 'modified name' });
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith({ ...mockUser, profileName: 'modified name' });
        expect(userModifiedSpy).toHaveBeenCalledWith({ ...mockUser, profileName: 'modified name' });
        expect(handleNotificationSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                resourceId: mockUser.id,
                message: 'Success'
            })
        );
        expect(response.payload).toBe(ThunkResponse.SUCCESS);
    });

    it('test getUser returns user fetched from backend', async () => {
        const fn = jest.fn();
        jest.spyOn(userApi, 'getUser').mockImplementation(fn.mockResolvedValue({
            response: mockUser,
            error: null
        }));
        const userAddedSpy = jest.spyOn(userSlice, 'userAdded');
        const setUserLoadingSpy = jest.spyOn(userSlice, 'setUserLoading');
        const action = userActions.getUser({ id: 8252, setLoggedInUser: true });
        const response = await action(dispatch, getState, undefined);
        expect(fn).toHaveBeenCalledWith(8252);
        expect(userAddedSpy).toHaveBeenCalledWith(mockUser);
        expect(setUserLoadingSpy).toHaveBeenCalled();
    });
});