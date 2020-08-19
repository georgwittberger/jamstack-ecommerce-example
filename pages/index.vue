<template>
  <div>
    <h1>JAMStack E-Commerce</h1>
    <p>This is a showcase of an e-commerce website built using the JAMStack.</p>
    <div>
      <nuxt-link to="/products" class="btn btn-primary">
        Browse all products
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class HomePage extends Vue {
  head() {
    return { title: 'JAMStack E-Commerce' }
  }
}
</script>

<style></style>
