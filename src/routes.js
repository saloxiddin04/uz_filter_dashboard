import {
  Profile,
  NotFound,
  Dashboard,
  Category,
  CreateCategory,
  Attributes,
  CreateAttributes,
  Brands,
  CreateBrands,
  Products,
  CreateProduct,
  Employees, Warehouse, CreateWarehouse, CreateProductWarehouse, AddProductWarehouse
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
  
  {path: '/products', element: Products},
  {path: '/products/:id', element: CreateProduct},
  
  {path: '/employees', element: Employees},
  
  {path: '/warehouses', element: Warehouse},
  {path: '/warehouses/:id', element: CreateWarehouse},
  {path: '/warehouse/products/:id', element: CreateProductWarehouse},
  {path: '/warehouse/products/:id/addProduct', element: AddProductWarehouse},
]