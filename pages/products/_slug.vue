<template>
  <div v-if="product">
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <ul>
      <li v-for="property in product.properties" :key="property">
        {{ property }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ProductResult } from '@/types/product'

@Component({
  async asyncData({ $content, params }) {
    const product: ProductResult = await $content(
      'products',
      params.slug
    ).fetch()
    return { product }
  },
})
export default class ProductDetail extends Vue {
  product: ProductResult | null = null

  head() {
    return { title: this.product ? this.product.name : 'Product' }
  }
}
</script>

<style></style>
