<template>
  <div>
    <h1>All Products</h1>
    <div class="row">
      <ProductTile
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ProductResult } from '@/types/product'

@Component({
  async asyncData({ $content }) {
    const products: ProductResult[] = await $content('products')
      .only(['id', 'name', 'description', 'slug'])
      .sortBy('name')
      .fetch()
    return { products }
  },
})
export default class ProductList extends Vue {
  products: ProductResult[] = []

  head() {
    return { title: 'All Products' }
  }
}
</script>

<style></style>
