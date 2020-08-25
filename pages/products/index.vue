<template>
  <div>
    <h1>All Products</h1>
    <b-row>
      <b-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductTile :product="product" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ProductResult } from '@/types/products/product'

@Component({
  async asyncData({ $content }) {
    const products: ProductResult[] = await $content('products')
      .only(['id', 'name', 'description', 'slug'])
      .sortBy('name')
      .fetch()
    return { products }
  },
})
export default class ProductListPage extends Vue {
  products: ProductResult[] = []

  head() {
    return { title: 'All Products' }
  }
}
</script>

<style></style>
