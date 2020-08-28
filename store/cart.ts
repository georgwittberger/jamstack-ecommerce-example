import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { v4 as uuid4 } from 'uuid'
import { $axios } from '@/plugins/global-axios'
import { CartItem } from '@/types/cart/cart-item'
import { CartConfiguration } from '@/types/cart/cart-configuration'
import { Order } from '@/types/cart/order'
import { ProductResult } from '@/types/products/product'

@Module({
  name: 'cart',
  stateFactory: true,
  namespaced: true,
})
export default class CartModule extends VuexModule {
  cartItems: CartItem[] = []
  cartConfiguration: CartConfiguration = {}
  recentOrderNumber: string = ''

  get cartItemsCount(): number {
    return this.cartItems.length
  }

  get cartTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0)
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
    item.totalPrice = item.unitPrice * quantity
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
  patchCartConfigurationState(
    cartConfiguration: Partial<CartConfiguration>
  ): void {
    this.cartConfiguration = { ...this.cartConfiguration, ...cartConfiguration }
  }

  @Mutation
  resetCartConfigurationState(): void {
    this.cartConfiguration = {}
  }

  @Mutation
  setCartState(cartState: PersistentCartState): void {
    this.cartItems = cartState.cartItems
    this.cartConfiguration = cartState.cartConfiguration
  }

  @Mutation
  setRecentOrderNumber(orderNumber: string): void {
    this.recentOrderNumber = orderNumber
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
      productSku: product.sku,
      productName: product.name,
      productSlug: product.slug,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
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
  updateCartConfiguration(cartConfiguration: Partial<CartConfiguration>): void {
    this.context.commit('patchCartConfigurationState', cartConfiguration)
    this.context.dispatch('persistState')
  }

  @Action
  async placeOrder(): Promise<Order> {
    const order: Order = await $axios.$post('/orders', {
      configuration: this.cartConfiguration,
      orderItems: this.cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      })),
    })
    this.context.commit('setRecentOrderNumber', order.number)
    this.context.commit('resetCartConfigurationState')
    this.context.commit('removeAllCartItemsFromState')
    this.context.dispatch('persistState')
    return order
  }

  @Action
  persistState(): void {
    const cartState: PersistentCartState = {
      cartItems: this.cartItems,
      cartConfiguration: this.cartConfiguration,
    }
    window.localStorage.setItem(cartStateStorageKey, JSON.stringify(cartState))
  }

  @Action
  restoreState(): void {
    const cartStateString = window.localStorage.getItem(cartStateStorageKey)
    if (!cartStateString) return
    const cartState: PersistentCartState = JSON.parse(cartStateString)
    this.context.commit('setCartState', cartState)
  }
}

const cartStateStorageKey = 'cart.state'

type AddCartItemOptions = {
  product: ProductResult
  quantity: number
}

type UpdateCartItemOptions = {
  cartItemId: string
  quantity?: number
}

type PersistentCartState = {
  cartItems: CartItem[]
  cartConfiguration: CartConfiguration
}
