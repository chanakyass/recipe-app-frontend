import { createAsyncThunk } from "@reduxjs/toolkit";
import { MainStoreStateType, Notification } from "../store.model";
import { errorAdded, notificationAdded, notificationRemoved, setTriggerNotification, setCurrentNotificationMessage } from "./notificationSlice";
import navigateToErrorPage from "../../util/error-handling";


export const handleError = createAsyncThunk('notifications/handleError', (partialNotification: Partial<Notification>, { dispatch }) => {
    if (partialNotification.error!.statusCode === 401 || partialNotification.error!.statusCode === 403) {
        dispatch(errorAdded({ ...partialNotification, errorType: 'VALIDATION' }));
    } else {
        navigateToErrorPage({ error: partialNotification.error! });
    }
});

export const handleNotification = createAsyncThunk('notifications/handleNotification', (partialNotification: Partial<Notification>, { dispatch }) => {
    dispatch(notificationAdded(partialNotification));
});

export const showNotifications = createAsyncThunk('notifications/showNotifications', async (_, { dispatch, getState }) => {
    let notfnState = (getState() as MainStoreStateType).notifications;
    if (!notfnState.triggerNotification) {
        dispatch(setTriggerNotification(true));
        let delay = 0;
        while (true) {
            const notfnState = (getState() as MainStoreStateType).notifications;
            if (notfnState.notifications.length === 0) {
                break;
            }
            setTimeout(() => ((ntfnMsg: string) => {
                dispatch(setCurrentNotificationMessage(ntfnMsg));
            })(notfnState.notifications[0].message!), delay);
            delay += 3000;
            dispatch(notificationRemoved({}));
            setTimeout(() => dispatch(setCurrentNotificationMessage('')), delay);
            delay += 2000;
        }
        dispatch(setTriggerNotification(false));
    }
});
