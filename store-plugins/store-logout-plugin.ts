import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

export function storeLogoutPlugin(store: Store<any>): void {
  let previouslyLoggedIn = store.state.auth?.loggedIn
  store.subscribe((mutation, state) => {
    const currentlyLoggedIn = state.auth?.loggedIn
    const hasLoggedOut = previouslyLoggedIn && !currentlyLoggedIn
    previouslyLoggedIn = currentlyLoggedIn
    if (hasLoggedOut) {
      handleLogout(store)
    }
  })
}

function handleLogout(store: Store<any>) {
  getModule(CartModule, store).clearCartItems()
}
