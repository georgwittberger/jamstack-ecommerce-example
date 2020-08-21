<template>
  <button @click="navigateToLoginPage" class="btn btn-secondary">Login</button>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LoginButton extends Vue {
  navigateToLoginPage() {
    this.$auth.redirect('login')
  }
}
</script>

<style></style>
