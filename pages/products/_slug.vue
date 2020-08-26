<template>
  <b-row v-if="product">
    <b-col cols="12" md="8">
      <h1>{{ product.name }}</h1>
      <p>Product Number: {{ product.sku }}</p>
      <p>{{ product.description }}</p>
      <p>{{ product.price | currency }}</p>
    </b-col>
    <b-col cols="12" md="4">
      <b-form>
        <b-form-group label="Quantity" label-for="quantity">
          <b-form-input
            id="quantity"
            type="number"
            number
            v-model="quantity"
          ></b-form-input>
        </b-form-group>
        <b-button variant="primary" @click="addProductToCart">
          Add to Cart
        </b-button>
      </b-form>
    </b-col>
  </b-row>
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
  private cartModule = getModule(CartModule, this.$store)

  head() {
    return { title: this.product ? this.product.name : 'Product' }
  }

  async addProductToCart() {
    if (!this.product) return
    try {
      await this.cartModule.addCartItem({
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
