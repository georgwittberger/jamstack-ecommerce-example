<template>
  <div class="container">
    <MainNavigation />
    <ClientOnly>
      <MiniCart />
    </ClientOnly>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class DefaultLayout extends Vue {}
</script>

<style></style>
