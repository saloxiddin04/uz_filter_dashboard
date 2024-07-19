import {
  Contracts,
  ContractDetail,
  Applications,
  ApplicationDetail,
  Dashboard,
  Profile,
  NotFound,
  CreateColocation, CreateVps, CreateEmail, CreateExpertise, CreateCertification, DataCenter
} from './pages';

export const routes = [
  { path: '*', element: NotFound },

  { path: '/dashboard', element: Dashboard },
  { path: '/profile', element: Profile },

  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:slug', element: Contracts },
  { path: '/shartnomalar/:slug/:id', element: ContractDetail },


  { path: '/application', element: Applications },
  { path: '/application/:id', element: ApplicationDetail },

  { path: '/data-center', element: DataCenter },
  { path: '/data-center/:id', element: DataCenter },

  
  {path: '/shartnomalar/colocation/create', element: CreateColocation },
  {path: '/shartnomalar/vps/create', element: CreateVps },
  {path: '/shartnomalar/e-xat/create', element: CreateEmail },
  {path: '/shartnomalar/expertise/create', element: CreateExpertise },
  {path: '/shartnomalar/tte_certification/create', element: CreateCertification },
]