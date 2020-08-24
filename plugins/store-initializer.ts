import { Plugin } from '@nuxt/types'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

const storeInitializerPlugin: Plugin = ({ store }) => {
  if (process.client) {
    getModule(CartModule, store).init()
  }
}

export default storeInitializerPlugin
