<template>
  <span>
    <nuxt-link to="/cart">Cart</nuxt-link>
    <span v-if="cartItemCount > 0" class="mini-cart__count">
      {{ cartItemCount }}
    </span>
  </span>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component
export default class MiniCart extends Vue {
  private cartStore!: CartModule

  created() {
    this.cartStore = getModule(CartModule, this.$store)
  }

  get cartItemCount() {
    return this.cartStore.cartItemCount
  }
}
</script>

<style></style>
