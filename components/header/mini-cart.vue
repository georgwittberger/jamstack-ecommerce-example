<template>
  <div>
    <nuxt-link to="/cart">Cart</nuxt-link>
    <span v-if="cartItemsCount > 0" class="mini-cart__count">
      {{ cartItemsCount }}
    </span>
  </div>
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

<style lang="scss">
@import '@/assets/css/variables';

.mini-cart__count {
  color: $primary;
  font-weight: bold;
}
</style>
