import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/auth/authSlice';
import sectionSlice from './slices/sections/sectionSlice';
import contractsSlice from './slices/contracts/contractsSlice';
import applicationsSlice from './slices/applications/applicationsSlice';
import dashboardSlice from './slices/dashboard/dashboardSlice';
import firstStepSlices from './slices/contractCreate/FirstStepSlices';
import createColocationSlices from './slices/contractCreate/Colocation/ColocationSlices';
import createVpsSlice from './slices/contractCreate/Vps/VpsSlices';
import createExpertiseSlice from './slices/contractCreate/Expertise/expertiseSlices';
import createCertificationSlice from './slices/contractCreate/Certification/CertificationSlice';
import dataCenterSlice from './slices/dataCenter/dataCenterSlice';
import registrySlice from "./slices/registry/registrySlice";

const appReducer = combineReducers({
  user: authSlice,
  dashboard: dashboardSlice,
  sections: sectionSlice,
  contracts: contractsSlice,
  dataCenter: dataCenterSlice,
  applications: applicationsSlice,
  userByTin: firstStepSlices,
  createColocation: createColocationSlices,
  createVps: createVpsSlice,
  createExpertise: createExpertiseSlice,
  createCertification: createCertificationSlice,
  registry: registrySlice,
});

const rootReducer = (state, action) => {
  // if (action.type === 'auth/oneIdLogOut/fulfilled') {
  //   state = undefined;
  //   // window.location.reload()
  // }
  // if (action.type === 'auth/oneIdLogOut/rejected') {
  //   state = undefined;
  //   // window.location.reload()
  // }
  return appReducer(state, action);
};

export default rootReducer;
