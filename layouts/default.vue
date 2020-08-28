<template>
  <div>
    <main-navigation />
    <b-container>
      <Nuxt />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class DefaultLayout extends Vue {}
</script>

<style></style>
