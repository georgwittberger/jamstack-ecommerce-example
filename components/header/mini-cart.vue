<template>
  <b-nav-item to="/cart">
    Cart
    <span v-if="cartItemsCount > 0"> ({{ cartItemsCount }}) </span>
  </b-nav-item>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component
export default class MiniCart extends Vue {
  private cartModule = getModule(CartModule, this.$store)

  get cartItemsCount() {
    return this.cartModule.cartItemsCount
  }
}
</script>

<style></style>
