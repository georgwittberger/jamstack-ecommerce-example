<template>
  <b-col cols="12" sm="6" md="4" lg="3">
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <div>
      <nuxt-link
        :to="`/products/${product.slug}`"
        no-prefetch
        class="btn btn-secondary"
      >
        Details
      </nuxt-link>
    </div>
  </b-col>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ProductResult } from '@/types/products/product'

@Component
export default class ProductTile extends Vue {
  @Prop()
  product!: ProductResult
}
</script>

<style lang="scss">
@import '@/assets/css/variables';

h2 {
  color: $primary;
}
</style>
