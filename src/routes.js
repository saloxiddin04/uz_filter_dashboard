import {
  Contracts,
  ContractDetail,
  Applications,
  ApplicationDetail,
  Dashboard,
  Profile,
  NotFound
} from './pages';

export const routes = [
  { path: '*', element: NotFound },

  { path: '/dashboard', element: Dashboard },
  { path: '/profile', element: Profile },

  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:id', element: ContractDetail },


  { path: '/application', element: Applications },
  { path: '/application/:id', element: ApplicationDetail },
]