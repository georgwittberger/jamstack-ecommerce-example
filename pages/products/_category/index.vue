<template>
  <div>
    <template v-if="category">
      <h1>{{ category.name }}</h1>
      <p>{{ category.description }}</p>
    </template>
    <div class="product-list__toolbar">
      <b-button-group>
        <b-button
          v-for="option in sortingOptions"
          :key="option.label"
          variant="outline-secondary"
          :pressed="selectedSortingOption === option"
          @click="selectedSortingOption = option"
        >
          {{ option.label }}
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
import { CategoryResult } from '@/types/categories/category'
import { ProductResult } from '@/types/products/product'

type SortingOption = { label: string; field: string; direction: string }
const sortingOptions: SortingOption[] = [
  { label: 'Sort by name ascending', field: 'name', direction: 'asc' },
  { label: 'Sort by name descending', field: 'name', direction: 'desc' },
]

@Component({
  async asyncData({ $content, params }) {
    const [category, products] = await Promise.all([
      $content('categories', params.category).fetch(),
      fetchProducts($content, params.category, sortingOptions[0]),
    ])
    return { category, products }
  },
})
export default class ProductCategoryPage extends Vue {
  category: CategoryResult | null = null
  products: Partial<ProductResult>[] = []
  selectedSortingOption: SortingOption = sortingOptions[0]

  get sortingOptions(): SortingOption[] {
    return sortingOptions
  }

  head() {
    return { title: this.category ? this.category.name : 'Category' }
  }

  @Watch('selectedSortingOption')
  async onSortingChanged(sortingOption: SortingOption) {
    this.products = await fetchProducts(
      this.$content,
      this.$route.params.category,
      sortingOption
    )
  }
}

function fetchProducts(
  $content: Vue['$content'],
  categorySlug: string,
  sortingOption: SortingOption
): Promise<Partial<ProductResult>[]> {
  return $content('products')
    .only(['id', 'name', 'description', 'slug', 'category'])
    .where({ 'category.slug': categorySlug })
    .sortBy(sortingOption.field, sortingOption.direction)
    .fetch()
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
