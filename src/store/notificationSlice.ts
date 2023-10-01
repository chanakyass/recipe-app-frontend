import { SliceCaseReducers, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MainStoreStateType, Notification, NotificationState } from "./store.model";
import navigateToErrorPage from "../util/error-handling";
import { v4 as uuid4 } from 'uuid';

const notificationSlice = createSlice<NotificationState, SliceCaseReducers<NotificationState>, string>({
    name: 'notifications',
    initialState: {
      errors: [],
      notifications: [],
      errorInView: false,
      notificationInView: false,
      currentNotificationMessage: '',
      triggerNotification: false,
    },
    reducers: {
        errorAdded(state, action) {
            const { payload: notification } = action;
            state.errors = [...state.errors, { ...notification, id: uuid4() }];
            state.errorInView = true;
        },
        notificationAdded(state, action) {
            const { payload: notification } = action;
            state.notifications = [...state.notifications, notification];
            state.notificationInView = true;
        },
        notificationRemoved(state) {
            if (state.notifications.length > 1) {
                state.notifications = state.notifications.slice(1);
            } else {
                state.notifications = [];
            }
        },
        setCurrentNotificationMessage(state, action) {
            const { payload: notificationMsg } = action as { payload: string, type: string };
            state.currentNotificationMessage = notificationMsg;
        },
        setTriggerNotification(state, action) {
            const { payload: triggerNotification } = action as { payload: boolean };
            state.triggerNotification = triggerNotification;
        },
        setNotificationInView(state, action) {
            console.log(action.payload)
            const { payload: notificationInView } = action as { payload: boolean };
            state.notificationInView = notificationInView;            
        }
    },
});

export const { errorAdded, notificationAdded, notificationRemoved, setCurrentNotificationMessage, setTriggerNotification, setNotificationInView } = notificationSlice.actions;

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
            setTimeout(() => ((ntfnMsg: string) => dispatch(setCurrentNotificationMessage(ntfnMsg)))(notfnState.notifications[0].message!), delay);
            delay += 3000;
            dispatch(notificationRemoved({}));
            setTimeout(() => dispatch(setCurrentNotificationMessage('')), delay);
            delay += 2000;
        }
        dispatch(setTriggerNotification(false));
    }
});

export default notificationSlice.reducer;