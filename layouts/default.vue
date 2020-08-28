<template>
  <div>
    <main-navigation />
    <b-container class="default-layout__container">
      <Nuxt />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class DefaultLayout extends Vue {}
</script>

<style lang="scss" scoped>
.default-layout__container {
  margin-top: 2rem;
  margin-bottom: 3rem;
}
</style>
