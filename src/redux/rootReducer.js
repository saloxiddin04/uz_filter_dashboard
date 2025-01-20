import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';

const appReducer = combineReducers({
  user: authSlice,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
