<template>
  <div v-if="product">
    <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
    <h1>{{ product.name }}</h1>
    <b-row>
      <b-col cols="12" md="4" class="product-detail__column">
        <b-img
          src="@/assets/images/dummy-product.png"
          :alt="product.name"
          fluid
        ></b-img>
      </b-col>
      <b-col cols="12" md="8" lg="4" class="product-detail__column">
        <p class="product-detail__product-number">
          Product Number: {{ product.sku }}
        </p>
        <p>{{ product.description }}</p>
        <p class="product-detail__price">{{ product.price | currency }}</p>
      </b-col>
      <b-col cols="12" lg="4" class="product-detail__column">
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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'
import { ProductResult } from '@/types/products/product'

const rootBreadcrumbItem = { text: 'All Products', to: '/products' }

@Component({
  async asyncData({ $content, params }) {
    const product = await $content('products', params.product).fetch<
      ProductResult
    >()
    const breadcrumbItems = [
      rootBreadcrumbItem,
      { text: product.category.name, to: `/products/${product.category.slug}` },
      { text: product.name, active: true },
    ]
    return { product, breadcrumbItems }
  },
})
export default class ProductDetailPage extends Vue {
  product: ProductResult | null = null
  quantity = 1
  breadcrumbItems = []
  private cartModule = getModule(CartModule, this.$store)

  head() {
    return {
      title: this.product ? this.product.name : 'Product',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.product ? this.product.description : '',
        },
      ],
    }
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

<style lang="scss" scoped>
@import '@/assets/css/variables';

.product-detail__column {
  margin-bottom: $grid-gutter-width;
}
.product-detail__product-number {
  color: $gray-500;
}
.product-detail__price {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
