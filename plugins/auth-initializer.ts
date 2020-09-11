import { Plugin } from '@nuxt/types'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

const authInitializerPlugin: Plugin = ({ $auth, store }) => {
  if (process.client) {
    if (!$auth.loggedIn) {
      // Ensure that anonymous users have no persisted cart configuration.
      // This is for cleanup when reloading the page after ID token expiration.
      getModule(CartModule, store).clearCartConfiguration()
    }
    $auth.$storage.watchState('loggedIn', (loggedIn: boolean) => {
      // Clean up cart configuration after user has logged out.
      if (!loggedIn) getModule(CartModule, store).clearCartConfiguration()
    })
  }
}

export default authInitializerPlugin
