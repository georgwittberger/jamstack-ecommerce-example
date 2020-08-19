<template>
  <div>
    <h1>Cart</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Product Name</th>
          <th scope="col">Product ID</th>
          <th scope="col">Quantity</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody @click="handleCartItemAction">
        <tr v-for="item in cartItems" :key="item.id">
          <td>{{ item.productName }}</td>
          <td>{{ item.productId }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button
              data-action="remove"
              :data-cart-item-id="item.id"
              class="btn btn-sm btn-secondary"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button @click="clearCart" class="btn btn-secondary">
        Clear cart
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component
export default class CartPage extends Vue {
  private cartStore!: CartModule

  created() {
    this.cartStore = getModule(CartModule, this.$store)
  }

  head() {
    return { title: 'Cart' }
  }

  get cartItems() {
    return this.cartStore.cartItems
  }

  handleCartItemAction(event: Event) {
    const element = event.target as HTMLElement
    const action = element.dataset.action
    if (!action) return
    if (action === 'remove') {
      const cartItemId = element.dataset.cartItemId
      if (!cartItemId) return
      this.cartStore.removeCartItem(cartItemId)
    }
  }

  clearCart() {
    this.cartStore.clearCartItems()
  }
}
</script>

<style></style>
