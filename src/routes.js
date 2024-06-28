import {Employees, Customers, Contracts, ContractDetail} from './pages';

export const routes = [
  { path: '/employees', element: Employees },
  { path: '/Customers', element: Customers },
  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:id', element: ContractDetail },
]