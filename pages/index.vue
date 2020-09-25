<template>
  <b-jumbotron
    header="JAMStack E-Commerce"
    lead="Showcase of an e-commerce website built with the JAMStack"
  >
    <p>
      Pre-generated static HTML files and a lightweight API server for a blazing
      fast shopping experience.
    </p>
    <b-button variant="primary" to="/products">Browse All Products</b-button>
    <b-button
      variant="secondary"
      href="https://github.com/georgwittberger/jamstack-ecommerce-example"
    >
      View GitHub Project
    </b-button>
  </b-jumbotron>
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
