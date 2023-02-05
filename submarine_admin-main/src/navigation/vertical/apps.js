// ** Icons Import
import { Settings, Package, Image } from 'react-feather'

export default [
  {
    header: 'Marketplace'
  },
  {
    id: 'collections',
    title: 'Collections',
    icon: <Package size={20} />,
    navLink: '/custom/collections'
  },
  {
    id: 'banners',
    title: 'Banners',
    icon: <Image size={20} />,
    navLink: '/custom/banners'
  },
  {
    id: 'email',
    title: 'Settings',
    icon: <Settings size={20} />,
    navLink: '/custom/settings'
  }
]
