import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import sectionSlice from "./slices/sections/sectionSlice";
import contractsSlice from "./slices/contracts/contractsSlice";
import applicationsSlice from "./slices/applications/applicationsSlice";

const store = configureStore({
  reducer: {
    user: authSlice,
    sections: sectionSlice,
    contracts: contractsSlice,
    applications: applicationsSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export default store