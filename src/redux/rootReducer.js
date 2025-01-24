import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import categorySlice from "./slices/utils/category/categorySlice";
import attributeSlice from "./slices/utils/attributes/attributeSlice";
import brandSlice from "./slices/utils/brands/brandSlice";
import productSlice from "./slices/products/productSlice";

const appReducer = combineReducers({
  user: authSlice,
  category: categorySlice,
  attribute: attributeSlice,
  brand: brandSlice,
  product: productSlice
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
