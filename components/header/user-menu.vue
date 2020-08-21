<template>
  <ul>
    <li>Logged in as: {{ $auth.user.name }}</li>
    <li><nuxt-link to="/user/profile">My User Profile</nuxt-link></li>
    <li><a @click="logout" href="#">Logout</a></li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class UserMenu extends Vue {
  logout(event: Event) {
    event.preventDefault()
    this.$auth.logout()
  }
}
</script>

<style></style>
