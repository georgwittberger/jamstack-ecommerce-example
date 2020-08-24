<template>
  <div>
    <h1>Cart</h1>
    <ClientOnly>
      <CartItemsTable />
    </ClientOnly>
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
  private cartModule = getModule(CartModule, this.$store)

  head() {
    return { title: 'Cart' }
  }

  clearCart() {
    this.cartModule.clearCartItems()
  }
}
</script>

<style></style>
