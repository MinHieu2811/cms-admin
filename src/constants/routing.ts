import { RolesSystem } from "./roles"

type RouteLabel = {
  label: string
  path: string
  children?: {
    label: string
    path: string
  }
  roles: RolesSystem[]
}

export const routingNavbar: RouteLabel[] = [
  {
    label: 'dashboard',
    path: '/dashboard',
    roles: [RolesSystem?.ADMIN],
  },
  {
    label: 'product',
    path: '/admin/product',
    roles: [RolesSystem?.PRODUCT]
  },
  {
    label: 'order',
    path: '/admin/order',
    roles: [RolesSystem?.ORDER]
  },
  {
    label: 'user',
    path: '/admin/users',
    roles: [RolesSystem?.HR]
  }
]