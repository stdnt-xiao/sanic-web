/**
 * Plugins for Pinia
 */

import { getFilterResponse ***REMOVED*** from '@/store/utils/mixin'
import router from '@/router'

export const pluginPinia = ({ store ***REMOVED******REMOVED*** => {
  store.filterResponse = getFilterResponse
  store.router = router
***REMOVED***
