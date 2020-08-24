import { Store } from 'vuex'
import { storeLogoutPlugin } from '@/store-plugins/store-logout-plugin'

export const plugins: Array<(store: Store<any>) => void> = [storeLogoutPlugin]
