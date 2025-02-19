import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import categorySlice from "./slices/utils/category/categorySlice";
import attributeSlice from "./slices/utils/attributes/attributeSlice";
import brandSlice from "./slices/utils/brands/brandSlice";
import productSlice from "./slices/products/productSlice";
import usersSlice from "./slices/users/usersSlice";
import warehouseSlice from "./slices/warehouse/warehouseSlice";
import transferWarehouseSlice from "./slices/transferWarehouse/transferWarehouseSlice";
import discountSlice from "./slices/discounts/discountSlice";
import discountAssignmentSlice from "./slices/discountAssignment/discountAssignmentSlice";

const appReducer = combineReducers({
  user: authSlice,
  category: categorySlice,
  attribute: attributeSlice,
  brand: brandSlice,
  product: productSlice,
  users: usersSlice,
  warehouse: warehouseSlice,
  transfer: transferWarehouseSlice,
  discount: discountSlice,
  discountAssignment: discountAssignmentSlice
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
