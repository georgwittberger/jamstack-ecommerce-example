<template>
  <div>
    <h1>Cart</h1>
    <client-only>
      <cart-items-table />
      <div v-if="hasCartItems">
        <p class="cart__total-price">
          Total Price: {{ totalPrice | currency }}
        </p>
        <b-button variant="outline-secondary" @click="clearCart">
          Clear Cart
        </b-button>
        <nuxt-link to="/checkout/configuration" class="btn btn-primary">
          Continue to Checkout
        </nuxt-link>
      </div>
    </client-only>
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
    return this.cartModule.cartItemsCount > 0
  }

  get totalPrice(): number {
    return this.cartModule.cartTotalPrice
  }

  head() {
    return { title: 'Cart' }
  }

  clearCart() {
    this.cartModule.clearCartItems()
  }
}
</script>

<style lang="scss" scoped>
.cart__total-price {
  font-weight: bold;
  text-align: right;
}
</style>
