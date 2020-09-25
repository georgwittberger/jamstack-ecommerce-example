<template>
  <div>
    <main-navigation />
    <b-container class="default-layout__container">
      <Nuxt />
    </b-container>
    <div class="default-layout__demo-hint">
      THIS IS NOT A REAL ONLINE SHOP! IT IS ONLY A DEMO FOR A GITHUB PROJECT!
    </div>
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
  margin-bottom: 4rem;
}
.default-layout__demo-hint {
  border: 2px solid red;
  color: red;
  background-color: #fee;
  font-weight: bold;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}
</style>
