import { Plugin } from '@nuxt/types'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

const storeInitPlugin: Plugin = ({ store }) => {
  getModule(CartModule, store).init()
}

export default storeInitPlugin
