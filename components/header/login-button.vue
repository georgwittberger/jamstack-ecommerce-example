<template>
  <b-nav-item href="#" @click="navigateToLoginPage">
    Login
  </b-nav-item>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LoginButton extends Vue {
  navigateToLoginPage(event: Event) {
    event.preventDefault()
    this.$auth.redirect('login')
  }
}
</script>

<style></style>
