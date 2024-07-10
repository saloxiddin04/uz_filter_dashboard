import {
  Contracts,
  ContractDetail,
  Applications,
  ApplicationDetail,
  Dashboard,
  Profile,
  NotFound,
  CreateColocation
} from './pages';

export const routes = [
  { path: '*', element: Dashboard },

  { path: '/dashboard', element: Dashboard },
  { path: '/profile', element: Profile },

  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:slug', element: Contracts },
  { path: '/shartnomalar/:slug/:id', element: ContractDetail },


  { path: '/application', element: Applications },
  { path: '/application/:id', element: ApplicationDetail },
  
  {path: '/shartnomalar/colocation/create', element: CreateColocation },
]