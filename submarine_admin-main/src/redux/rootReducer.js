// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import setting from '@src/views/custom/settings/store'
import banner from '@src/views/custom/banners/store'
import collection from '@src/views/custom/collections/store'

const rootReducer = {
  auth,
  setting,
  banner,
  collection,
  navbar,
  layout
}

export default rootReducer
