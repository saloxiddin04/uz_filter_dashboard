import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import sectionSlice from "./slices/sections/sectionSlice";
import contractsSlice from "./slices/contracts/contractsSlice";
import applicationsSlice from "./slices/applications/applicationsSlice";
import dashboardSlice from "./slices/dashboard/dashboardSlice";
import firstStepSlices from "./slices/contractCreate/FirstStepSlices";
import createColocationSlices from "./slices/contractCreate/Colocation/ColocationSlices";
import createVpsSlice from "./slices/contractCreate/Vps/VpsSlices";

const store = configureStore({
  reducer: {
    user: authSlice,
    dashboard: dashboardSlice,
    sections: sectionSlice,
    contracts: contractsSlice,
    applications: applicationsSlice,
    userByTin: firstStepSlices,
    createColocation: createColocationSlices,
    createVps: createVpsSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export default store