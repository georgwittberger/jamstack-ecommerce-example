<template>
  <b-card
    :title="product.name"
    title-tag="h2"
    img-src="@/assets/images/dummy-product.png"
    :img-alt="product.name"
    img-top
  >
    <b-card-text class="product-tile__text">
      {{ product.description }}
    </b-card-text>
    <nuxt-link
      :to="`/products/${product.slug}`"
      no-prefetch
      class="btn btn-outline-secondary"
    >
      Details
    </nuxt-link>
  </b-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ProductResult } from '@/types/products/product'

@Component
export default class ProductTile extends Vue {
  @Prop() product!: Partial<ProductResult>
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.2rem;
}
.product-tile__text {
  height: 6rem;
  overflow: hidden;
}
</style>
