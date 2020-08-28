<template>
  <b-navbar toggleable="lg" variant="light">
    <b-container>
      <b-navbar-brand to="/">DemoTools</b-navbar-brand>
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

  async created() {
    this.mainNavigationContent = await this.$content('main-navigation').fetch()
  }
}
</script>

<style></style>
