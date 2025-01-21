import {
  Contracts,
  ContractDetail,
  Profile,
  NotFound,
  Dashboard, Category, CreateCategory
} from './pages';

export const routes = [
  { path: '*', element: NotFound },
  // { path: '/code', element: Code },

  { path: '/profile', element: Profile },

  { path: '/dashboard', element: Dashboard },

  { path: '/category', element: Category },
  { path: '/category/:id', element: CreateCategory },

  { path: '/shartnomalar', element: Contracts },
  { path: '/shartnomalar/:slug', element: Contracts },
  { path: '/shartnomalar/:slug/:id', element: ContractDetail },
]