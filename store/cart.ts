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
  items: CartItem[] = []

  get cartItemCount(): number {
    return this.items.length
  }

  @Mutation
  addCartItemToState(item: CartItem) {
    this.items = [...this.items, item]
  }

  @Mutation
  setCartItemsState(items: CartItem[]) {
    this.items = items
  }

  @Action
  init() {
    const cartItems = restoreCartItems()
    this.context.commit('setCartItemsState', cartItems)
  }

  @Action
  async addCartItem({
    product,
    quantity,
  }: AddCartItemOptions): Promise<CartItem> {
    const item: CartItem = {
      id: uuid4(),
      productId: product.id,
      productName: product.name,
      quantity,
    }
    this.context.commit('addCartItemToState', item)
    persistCartItems(this.items)
    return item
  }
}

interface AddCartItemOptions {
  product: Product
  quantity: number
}

const cartItemsStorageKey = 'cart.items'

function persistCartItems(items: CartItem[]) {
  window.sessionStorage.setItem(cartItemsStorageKey, JSON.stringify(items))
}

function restoreCartItems(): CartItem[] {
  const cartItems = window.sessionStorage.getItem(cartItemsStorageKey)
  if (!cartItems) return []
  return JSON.parse(cartItems)
}
