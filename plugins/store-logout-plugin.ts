import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

const storeLogoutPlugin: (store: Store<any>) => void = (store) => {
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

export default storeLogoutPlugin

function handleLogout(store: Store<any>) {
  const cartStore = getModule(CartModule, store)
  cartStore.clearCartItems()
}
