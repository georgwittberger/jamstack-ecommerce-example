import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { v4 as uuid4 } from 'uuid'
import { CartItem } from '@/types/cart/cart-item'
import { Product } from '@/types/products/product'

const cartStateStorageKey = 'cart.state'

@Module({
  name: 'cart',
  stateFactory: true,
  namespaced: true,
})
export default class CartModule extends VuexModule {
  cartItems: CartItem[] = []

  get cartItemsCount(): number {
    return this.cartItems.length
  }

  @Mutation
  addCartItemToState(item: CartItem): void {
    this.cartItems = [...this.cartItems, item]
  }

  @Mutation
  removeCartItemFromState(id: string): void {
    const itemIndex = this.cartItems.findIndex((item) => item.id === id)
    if (itemIndex < 0) return
    const remainingCartItems = [...this.cartItems]
    remainingCartItems.splice(itemIndex, 1)
    this.cartItems = remainingCartItems
  }

  @Mutation
  removeAllCartItemsFromState(): void {
    this.cartItems = []
  }

  @Mutation
  setCartState(cartState: PersistentCartState): void {
    this.cartItems = cartState.cartItems
  }

  @Action
  init(): void {
    this.context.dispatch('restoreState')
  }

  @Action
  addCartItem({ product, quantity }: AddCartItemOptions): CartItem {
    const item: CartItem = {
      id: uuid4(),
      productId: product.id,
      productName: product.name,
      quantity,
    }
    this.context.commit('addCartItemToState', item)
    this.context.dispatch('persistState')
    return item
  }

  @Action
  removeCartItem(id: string): void {
    this.context.commit('removeCartItemFromState', id)
    this.context.dispatch('persistState')
  }

  @Action
  clearCartItems(): void {
    this.context.commit('removeAllCartItemsFromState')
    this.context.dispatch('persistState')
  }

  @Action
  persistState(): void {
    const cartState: PersistentCartState = { cartItems: this.cartItems }
    window.sessionStorage.setItem(
      cartStateStorageKey,
      JSON.stringify(cartState)
    )
  }

  @Action
  restoreState(): void {
    const cartStateString = window.sessionStorage.getItem(cartStateStorageKey)
    if (!cartStateString) return
    const cartState: PersistentCartState = JSON.parse(cartStateString)
    this.context.commit('setCartState', cartState)
  }
}

interface AddCartItemOptions {
  product: Product
  quantity: number
}

interface PersistentCartState {
  cartItems: CartItem[]
}
