<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Product Name</th>
        <th scope="col">Product Number</th>
        <th scope="col">Quantity</th>
        <th scope="col">Total Price</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cartItem in cartItems" :key="cartItem.id">
        <td>{{ cartItem.productName }}</td>
        <td>{{ cartItem.productSku }}</td>
        <td>
          <b-form-input
            type="number"
            number
            size="sm"
            :value="cartItem.quantity"
            @update="updateCartItemQuantity(cartItem, $event)"
          ></b-form-input>
        </td>
        <td>{{ cartItem.totalPrice | currency }}</td>
        <td>
          <b-button
            size="sm"
            variant="outline-secondary"
            @click="removeCartItem(cartItem)"
          >
            Remove
          </b-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'
import { CartItem } from '@/types/cart/cart-item'

@Component
export default class CartItemsTable extends Vue {
  private cartModule = getModule(CartModule, this.$store)

  get cartItems() {
    return this.cartModule.cartItems
  }

  updateCartItemQuantity(item: CartItem, quantity: number) {
    this.cartModule.updateCartItem({ cartItemId: item.id, quantity })
  }

  removeCartItem(item: CartItem) {
    this.cartModule.removeCartItem(item.id)
  }
}
</script>

<style></style>
