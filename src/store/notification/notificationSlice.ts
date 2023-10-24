import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { NotificationState } from "../store.model";
import { v4 as uuid4 } from 'uuid';

const notificationSlice = createSlice<NotificationState, SliceCaseReducers<NotificationState>, string>({
    name: 'notifications',
    initialState: {
      errors: [],
      notifications: [],
      currentNotificationMessage: '',
      triggerNotification: false,
    },
    reducers: {
        errorAdded(state, action) {
            const { payload: notification } = action;
            state.errors = [...state.errors, { ...notification, id: uuid4() }];
        },
        notificationAdded(state, action) {
            const { payload: notification } = action;
            state.notifications = [...state.notifications, notification];
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
    },
});

export const { errorAdded, notificationAdded, notificationRemoved, setCurrentNotificationMessage, setTriggerNotification } = notificationSlice.actions;

export default notificationSlice.reducer;