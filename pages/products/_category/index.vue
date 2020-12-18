<template>
  <div>
    <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
    <template v-if="category">
      <h1>{{ category.name }}</h1>
      <p>{{ category.description }}</p>
    </template>
    <div class="product-list__toolbar">
      <b-button-group>
        <b-button
          v-for="productSortOption in productSortOptions"
          :key="productSortOption.label"
          variant="outline-secondary"
          :pressed="selectedProductSortOption === productSortOption"
          @click="selectedProductSortOption = productSortOption"
        >
          {{ productSortOption.label }}
        </b-button>
      </b-button-group>
    </div>
    <b-row>
      <b-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="product-list__tile"
      >
        <product-tile :product="product" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { IContentDocument } from '@nuxt/content/types/content'
import { CategoryDocument } from '@/types/categories/category'
import { ProductDocument } from '@/types/products/product'
import { ProductSortOption, sortProducts } from '@/libs/product-sort'

const rootBreadcrumbItem = { text: 'All Products', to: '/products' }

@Component({
  async asyncData({ $content, params }) {
    const [category, products] = await Promise.all([
      $content(
        'categories',
        params.category
      ).fetch<CategoryDocument>() as Promise<
        CategoryDocument & IContentDocument
      >,
      $content('products', params.category)
        .only(['id', 'name', 'description', 'slug', 'category'])
        .sortBy('name')
        .fetch<ProductDocument>() as Promise<
        Partial<ProductDocument & IContentDocument>[]
      >,
    ])
    const breadcrumbItems = [
      rootBreadcrumbItem,
      { text: category.name, active: true },
    ]
    return { category, products, breadcrumbItems }
  },
})
export default class ProductCategoryPage extends Vue {
  category: (CategoryDocument & IContentDocument) | null = null
  products: Partial<ProductDocument & IContentDocument>[] = []
  productSortOptions: ProductSortOption[] = [
    { label: 'Sort by name ascending', field: 'name', direction: 'asc' },
    { label: 'Sort by name descending', field: 'name', direction: 'desc' },
  ]
  selectedProductSortOption: ProductSortOption = this.productSortOptions[0]
  breadcrumbItems = []

  head() {
    return {
      title: this.category ? this.category.name : 'Category',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Overview of products belonging to category ${this.category?.name}`,
        },
      ],
    }
  }

  @Watch('selectedProductSortOption')
  onProductSortOptionChanged(productSortOption: ProductSortOption) {
    this.products = sortProducts(this.products, productSortOption)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables';

.product-list__toolbar {
  margin-bottom: $grid-gutter-width;
}
.product-list__tile {
  margin-bottom: $grid-gutter-width;
}
</style>
