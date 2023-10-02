import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../services";
import { handleError, handleNotification } from "../notification";
import { setUserLoading, userAdded, userModified } from "./userSlice";
import { AuthRequest, Notification, ThunkResponse, User } from "../store.model";


export const getUser = createAsyncThunk("users/getUser", async ({ id, setLoggedInUser }: { id: number; setLoggedInUser: boolean; }, { dispatch }) => {
    dispatch(setUserLoading(true));
    const { response: user, error } = await userApi.getUser(id);
    const notification: Partial<Notification> = { resourceType: 'user', action: 'READ' };
    if (error) {
        dispatch(handleError({ ...notification, error }));
    } else {
        if (setLoggedInUser) {
            dispatch(userAdded(user));
        }
    }
    dispatch(setUserLoading(false));
    return user;
});

export const registerUser = createAsyncThunk("users/registerUser", async (user: User, { dispatch }) => {
    const { response: userInResponse, error } = await userApi.registerUser(user);
    let notification: Partial<Notification> = { resourceType: 'user', action: 'REGISTER' };
    if (error) {
        await dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        const message = 'Sucessfully created your account. Taking you to the homepage.';
        dispatch(userAdded(userInResponse));
        await dispatch(handleNotification({ resourceId: userInResponse?.id, ...notification, message }));
        return ThunkResponse.SUCCESS;
    }
});

export const loginUser = createAsyncThunk("users/loginUser", async (authRequest: AuthRequest, { dispatch }) => {
    const { response: userProxy, error } = await userApi.loginUser(authRequest);
    let notification: Partial<Notification> = { resourceType: 'user', action: 'LOGIN' };
    if (error) {
        await dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        const message = 'Login was successful';
        dispatch(handleNotification({ resourceId: userProxy?.id, ...notification, message } as Notification));
        return ThunkResponse.SUCCESS;
    }
});

export const modifyUser = createAsyncThunk("users/modifyUser", async (user: User, { dispatch }) => {
    const { response: apiMessageResponse, error } = await userApi.updateUser(user);
    let notification: Partial<Notification> = { resourceType: 'user', action: 'MODIFY' };
    if (error) {
        await dispatch(handleError({ error, ...notification }));
        return ThunkResponse.FAILURE;
    } else {
        dispatch(userModified(user));
        await dispatch(handleNotification({ resourceId: apiMessageResponse?.generatedId, ...notification, message: apiMessageResponse?.message }));
        return ThunkResponse.SUCCESS;

    }
});
