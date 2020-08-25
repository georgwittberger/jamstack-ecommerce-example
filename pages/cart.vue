<template>
  <div>
    <h1>Cart</h1>
    <ClientOnly>
      <CartItemsTable />
      <div v-if="hasCartItems">
        <b-button variant="outline-secondary" @click="clearCart">
          Clear Cart
        </b-button>
        <nuxt-link to="/checkout/configuration" class="btn btn-primary">
          Continue to Checkout
        </nuxt-link>
      </div>
    </ClientOnly>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component
export default class CartPage extends Vue {
  private cartModule = getModule(CartModule, this.$store)

  get hasCartItems(): boolean {
    return this.cartModule.cartItems.length > 0
  }

  head() {
    return { title: 'Cart' }
  }

  clearCart() {
    this.cartModule.clearCartItems()
  }
}
</script>

<style></style>
