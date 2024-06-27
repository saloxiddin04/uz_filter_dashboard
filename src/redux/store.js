import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import sectionSlice from "./slices/sections/sectionSlice";
import contractsSlice from "./slices/contracts/contractsSlice";

const store = configureStore({
  reducer: {
    user: authSlice,
    sections: sectionSlice,
    contracts: contractsSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export default store