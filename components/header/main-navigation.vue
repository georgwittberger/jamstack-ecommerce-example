<template>
  <b-navbar toggleable="lg" variant="primary" type="dark">
    <b-container>
      <b-navbar-brand to="/">
        <img
          src="@/assets/images/header-logo.svg"
          alt="Demo Tools Logo"
          width="576"
          height="128"
          class="main-nav__logo"
        />
      </b-navbar-brand>
      <b-navbar-toggle target="main-nav-collapse"></b-navbar-toggle>
      <b-collapse id="main-nav-collapse" is-nav>
        <b-navbar-nav v-if="mainNavigationContent">
          <b-nav-item
            v-for="entry in mainNavigationContent.entries"
            :key="entry.name"
            :to="entry.path"
          >
            {{ entry.name }}
          </b-nav-item>
        </b-navbar-nav>
        <client-only>
          <b-navbar-nav class="ml-auto">
            <mini-cart />
            <login-button v-if="!$auth.loggedIn" />
            <user-menu v-if="$auth.loggedIn" />
          </b-navbar-nav>
        </client-only>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { MainNavigationResult } from '@/types/header/main-navigation'

@Component
export default class MainNavigation extends Vue {
  mainNavigationContent: MainNavigationResult | null = null

  async fetch() {
    this.mainNavigationContent = await this.$content('main-navigation').fetch()
  }
}
</script>

<style lang="scss" scoped>
.main-nav__logo {
  height: 1.5rem;
  width: auto;
}
</style>
