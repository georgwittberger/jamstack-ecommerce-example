<template>
  <b-nav-item-dropdown right>
    <template v-slot:button-content>
      {{ $auth.user.name }}
    </template>
    <b-dropdown-item to="/user/profile">My User Profile</b-dropdown-item>
    <b-dropdown-item href="#" @click.prevent="logout">Logout</b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class UserMenu extends Vue {
  logout() {
    sessionStorage.setItem('app.logout.intent', 'true')
    location.href = process.env.LOGOUT_URL || '/logout'
  }
}
</script>

<style></style>
