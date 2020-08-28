<template>
  <b-nav-item-dropdown right>
    <template v-slot:button-content>
      {{ $auth.user.name }}
    </template>
    <b-dropdown-item to="/user/profile">My User Profile</b-dropdown-item>
    <b-dropdown-item href="#" @click="logout">Logout</b-dropdown-item>
  </b-nav-item-dropdown>
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
