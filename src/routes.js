import {
  Profile,
  NotFound,
  Dashboard, Category, CreateCategory, Attributes, CreateAttributes, Brands, CreateBrands
} from './pages';

export const routes = [
  { path: '*', element: NotFound },

  { path: '/profile', element: Profile },

  { path: '/dashboard', element: Dashboard },

  { path: '/category', element: Category },
  { path: '/category/:id', element: CreateCategory },

  { path: '/attributes', element: Attributes },
  { path: '/attributes/:id', element: CreateAttributes },

  { path: '/brands', element: Brands },
  { path: '/brands/:id', element: CreateBrands },
]