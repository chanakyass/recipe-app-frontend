import { PreloadedState, combineReducers, configureStore } from '@reduxjs/toolkit';

import notificationReducer from './notification';
import recipesReducer from './recipe';
import userReducer from './user';

const rootReducer = combineReducers({
  recipes: recipesReducer,
  users: userReducer,
  notifications: notificationReducer,  
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppRootReducerType = typeof rootReducer;

export const setupConfiguredStore = (preloadedState?: PreloadedState<RootState>) => {
  let params: { reducer: AppRootReducerType, preloadedState?: PreloadedState<RootState> } = {
    reducer: rootReducer,
  };

  if (preloadedState) {
    params = {
      ...params,
      preloadedState,
    };
  }

  return configureStore(params);
};

const store = setupConfiguredStore();

export default store;