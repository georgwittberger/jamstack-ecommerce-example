import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { v4 as uuid4 } from 'uuid'
import { CartItem } from '@/types/cart/cart-item'
import { Product } from '@/types/products/product'

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
  updateCartItemQuantity({
    cartItemId,
    quantity,
  }: {
    cartItemId: string
    quantity: number
  }): void {
    const item = this.cartItems.find((item) => item.id === cartItemId)
    if (!item) return
    item.quantity = quantity
    this.cartItems = [...this.cartItems]
  }

  @Mutation
  removeCartItemFromState(cartItemId: string): void {
    const itemIndex = this.cartItems.findIndex((item) => item.id === cartItemId)
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
  updateCartItem({ cartItemId, quantity }: UpdateCartItemOptions): void {
    if (typeof quantity !== 'undefined') {
      this.context.commit('updateCartItemQuantity', { cartItemId, quantity })
    }
    this.context.dispatch('persistState')
  }

  @Action
  removeCartItem(cartItemId: string): void {
    this.context.commit('removeCartItemFromState', cartItemId)
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

const cartStateStorageKey = 'cart.state'

interface AddCartItemOptions {
  product: Product
  quantity: number
}

interface UpdateCartItemOptions {
  cartItemId: string
  quantity?: number
}

interface PersistentCartState {
  cartItems: CartItem[]
}
