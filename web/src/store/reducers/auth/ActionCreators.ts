import { AppDispatch } from 'store/store';
import { authAPI } from 'api/api';
import { anonym } from 'models/IUser';
import { authSlice } from './AuthSlice';

export const checkAuth = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());
    await authAPI.refreshAuth();
    dispatch(authSlice.actions.authFetchingSuccess({ isAnonym: false }));
  } catch (e) {
    dispatch(authSlice.actions.authFetchingError());
  }
  await dispatch(authSlice.actions.isFirstAuth());
};

export const loginAuth = (login: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());
    const result = await authAPI.login(login, password);
    dispatch(authSlice.actions.authFetchingSuccess({ isAnonym: false }));
    return result.status;
  } catch (e) {
    dispatch(authSlice.actions.authFetchingError());
    if (e.response?.status === 401) return 401;
    console.error(e.response?.data?.message);
    console.error(e.message);
    return e.response?.status;
  }
};

export const logoutAuth = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetching());
    await authAPI.logout();
    dispatch(authSlice.actions.authFetchingSuccess(anonym));
  } catch (e) {
    console.error(e.response?.data?.message);
    console.error(e.message);
    dispatch(authSlice.actions.authFetchingError());
  }
};

export default null;
