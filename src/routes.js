import {
  Contracts,
  ContractDetail,
  Applications,
  ApplicationDetail,
  Dashboard,
  Profile,
  NotFound,
  CreateColocation,
  CreateVps,
  CreateEmail,
  CreateExpertise,
  CreateCertification,
  DataCenter,
  Registry, CreateRegistry,
  RegistryDetail, Xizmatlar, AdmissionDataCenter
} from './pages';
import ShowRack from "./components/DataCenter/ShowRack";
import Code from "./redux/slices/auth/Code";

export const routes = [
  { path: '*', element: NotFound },
  // { path: '/code', element: Code },

  { path: '/dashboard', element: Dashboard },
  { path: '/profile', element: Profile },
  { path: '/xizmatlar', element: Xizmatlar },

  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:slug', element: Contracts },
  { path: '/shartnomalar/:slug/:id', element: ContractDetail },


  { path: '/application', element: Applications },
  { path: '/application/:id', element: ApplicationDetail },

  { path: '/data-center', element: DataCenter },
  { path: '/data-center/:id', element: DataCenter },
  { path: 'data-center/:id/rack/:rackId', element: ShowRack },
  { path: '/data-center/data-center-admission', element: AdmissionDataCenter },

  {path: '/shartnomalar/colocation/create', element: CreateColocation },
  {path: '/shartnomalar/vps/create', element: CreateVps },
  {path: '/shartnomalar/e-xat/create', element: CreateEmail },
  {path: '/shartnomalar/expertise/create', element: CreateExpertise },
  {path: '/shartnomalar/tte_certification/create', element: CreateCertification },

  {path: '/registry', element: Registry },
  {path: '/registry/:slug', element: Registry },
  {path: '/registry/:slug/:id', element: RegistryDetail },
  {path: '/registry/:slug/create', element: CreateRegistry },
]