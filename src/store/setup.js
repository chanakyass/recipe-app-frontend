import { configureStore } from '@reduxjs/toolkit'

import recipesReducer from './recipe';
import userReducer from './user';
import notificationReducer from './notification';

const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    users: userReducer,
    notifications: notificationReducer,
  },
});

export default store;