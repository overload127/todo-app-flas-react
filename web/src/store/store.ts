import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth/AuthSlice';
import todoReducer from './reducers/todo/TodoSlice';

const rootReducer = combineReducers({
  authReducer,
  todoReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
const store = setupStore();
export default store;
