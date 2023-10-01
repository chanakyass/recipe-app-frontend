import { configureStore } from '@reduxjs/toolkit'

import recipesReducer from './recipeSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    users: userReducer,
    notifications: notificationReducer,
  },
});

export default store;