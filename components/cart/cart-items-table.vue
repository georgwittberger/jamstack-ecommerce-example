<template>
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
      <tr v-for="cartItem in cartItems" :key="cartItem.id">
        <td>{{ cartItem.productName }}</td>
        <td>{{ cartItem.productId }}</td>
        <td>{{ cartItem.quantity }}</td>
        <td>
          <button
            data-action="remove"
            :data-cart-item-id="cartItem.id"
            class="btn btn-sm btn-secondary"
          >
            Remove
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component
export default class CartItemsTable extends Vue {
  private cartStore!: CartModule

  created() {
    this.cartStore = getModule(CartModule, this.$store)
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
}
</script>

<style></style>
