<template>
  <div>
    <h1>All Products</h1>
    <b-row>
      <b-col cols="12" md="3">
        <b-list-group class="product-list__categories">
          <b-list-group-item
            v-for="category in categories"
            :key="category.name"
            :to="`/products/${category.slug}`"
          >
            {{ category.name }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col cols="12" md="9">
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
            lg="4"
            class="product-list__tile"
          >
            <product-tile :product="product" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { IContentDocument } from '@nuxt/content/types/content'
import { CategoryDocument } from '@/types/categories/category'
import { ProductDocument } from '@/types/products/product'

type SortingOption = { label: string; field: string; direction: 'asc' | 'desc' }
const sortingOptions: SortingOption[] = [
  { label: 'Sort by name ascending', field: 'name', direction: 'asc' },
  { label: 'Sort by name descending', field: 'name', direction: 'desc' },
]

@Component({
  async asyncData({ $content }) {
    const [categories, products] = await Promise.all([
      $content('categories')
        .only(['name', 'slug'])
        .sortBy('name')
        .fetch<CategoryDocument>() as Promise<Partial<CategoryDocument & IContentDocument>[]>,
      fetchProducts($content, sortingOptions[0]),
    ])
    return { categories, products }
  },
})
export default class AllProductsPage extends Vue {
  categories: Partial<CategoryDocument & IContentDocument>[] = []
  products: Partial<ProductDocument & IContentDocument>[] = []
  selectedSortingOption: SortingOption = sortingOptions[0]

  get sortingOptions(): SortingOption[] {
    return sortingOptions
  }

  head() {
    return {
      title: 'All Products',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Overview of all products',
        },
      ],
    }
  }

  @Watch('selectedSortingOption')
  async onSortingChanged(sortingOption: SortingOption) {
    this.products = await fetchProducts(this.$content, sortingOption)
  }
}

function fetchProducts(
  $content: Vue['$content'],
  sortingOption: SortingOption
): Promise<Partial<ProductDocument & IContentDocument>[]> {
  return $content('products', { deep: true })
    .only(['id', 'name', 'description', 'slug', 'category'])
    .sortBy(sortingOption.field, sortingOption.direction)
    .fetch<ProductDocument>() as Promise<Partial<ProductDocument & IContentDocument>[]>
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables';

.product-list__categories {
  margin-bottom: $grid-gutter-width;
}
.product-list__toolbar {
  margin-bottom: $grid-gutter-width;
}
.product-list__tile {
  margin-bottom: $grid-gutter-width;
}
</style>
