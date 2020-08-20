<template>
  <div>
    <h1>Logging in... please wait</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LoginCallbackPage extends Vue {
  head() {
    return { title: 'Logging in...' }
  }
}
</script>

<style></style>
