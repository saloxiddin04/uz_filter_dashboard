import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import sectionSlice from "./slices/sections/sectionSlice";
import contractsSlice from "./slices/contracts/contractsSlice";
import applicationsSlice from "./slices/applications/applicationsSlice";
import dashboardSlice from "./slices/dashboard/dashboardSlice";
import firstStepSlices from "./slices/contractCreate/FirstStepSlices";
import createColocationSlices from "./slices/contractCreate/Colocation/ColocationSlices";
import createVpsSlice from "./slices/contractCreate/Vps/VpsSlices";
import createExpertiseSlice from "./slices/contractCreate/Expertise/expertiseSlices";
import createCertificationSlice from "./slices/contractCreate/Certification/CertificationSlice";

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
    createExpertise: createExpertiseSlice,
    createCertification: createCertificationSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export default store