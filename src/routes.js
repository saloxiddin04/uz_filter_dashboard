import {
  Contracts,
  ContractDetail,
  Applications,
  ApplicationDetail,
  Dashboard
} from './pages';

export const routes = [
  { path: '/dashboard', element: Dashboard },

  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:id', element: ContractDetail },


  { path: '/application', element: Applications },
  { path: '/application/:id', element: ApplicationDetail },
]