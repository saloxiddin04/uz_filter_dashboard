import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import categorySlice from "./slices/category/categorySlice";

const appReducer = combineReducers({
  user: authSlice,
  category: categorySlice
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
