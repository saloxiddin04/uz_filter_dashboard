import {
  Employees,
  Customers,
  Contracts,
  ContractDetail,
  Applications,
  ApplicationDetail
} from './pages';

export const routes = [
  { path: '/employees', element: Employees },
  { path: '/Customers', element: Customers },
  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:id', element: ContractDetail },


  { path: '/application', element: Applications },
  { path: '/application/:id', element: ApplicationDetail },
]