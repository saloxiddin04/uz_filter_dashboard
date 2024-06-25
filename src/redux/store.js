import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";

const store = configureStore({
  reducer: {
    user: authSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export default store