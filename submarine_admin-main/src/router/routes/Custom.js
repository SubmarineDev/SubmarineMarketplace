import { lazy } from 'react'

const Settings = lazy(() => import('../../views/custom/settings'))
const Collections = lazy(() => import('../../views/custom/collections'))
const Banners = lazy(() => import('../../views/custom/banners'))
const Account = lazy(() => import('../../views/custom/account'))

const CustomRoutes = [
  {
    path: '/custom/settings',
    element: <Settings />
  },
  {
    path: '/custom/collections',
    element: <Collections />
  },
  {
    path: '/custom/banners',
    element: <Banners />
  },
  {
    path: '/custom/account',
    element: <Account />
  }
]

export default CustomRoutes
