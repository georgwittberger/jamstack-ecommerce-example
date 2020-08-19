<template>
  <div v-if="product">
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <ul>
      <li v-for="property in product.properties" :key="property">
        {{ property }}
      </li>
    </ul>
    <div>
      <input type="number" v-model="quantity" />
      <button @click="addItemToCart" class="btn btn-primary">
        Add to cart
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'
import { ProductResult } from '@/types/products/product'

@Component({
  async asyncData({ $content, params }) {
    const product: ProductResult = await $content(
      'products',
      params.slug
    ).fetch()
    return { product }
  },
})
export default class ProductDetailPage extends Vue {
  product: ProductResult | null = null
  quantity = 1
  private cartStore!: CartModule

  created() {
    this.cartStore = getModule(CartModule, this.$store)
  }

  head() {
    return { title: this.product ? this.product.name : 'Product' }
  }

  async addItemToCart() {
    if (!this.product) return
    try {
      await this.cartStore.addCartItem({
        product: this.product,
        quantity: this.quantity,
      })
    } catch (error) {
      console.error('Error adding product to cart', error)
    }
  }
}
</script>

<style></style>
