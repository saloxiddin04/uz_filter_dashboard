import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import sectionSlice from "./slices/sections/sectionSlice";

const store = configureStore({
  reducer: {
    user: authSlice,
    sections: sectionSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export default store