<template>
  <div class="col-sm-6 col-md-4 col-lg-3">
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ProductResult } from '~/types/product'

@Component
export default class ProductTile extends Vue {
  @Prop()
  product!: ProductResult
}
</script>

<style></style>
