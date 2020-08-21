<template>
  <div>
    <ul v-if="mainNavigationContent">
      <li v-for="entry in mainNavigationContent.entries" :key="entry.name">
        <nuxt-link :to="entry.path">{{ entry.name }}</nuxt-link>
      </li>
    </ul>
    <ClientOnly>
      <LoginButton v-if="!$auth.loggedIn" />
      <UserMenu v-if="$auth.loggedIn" />
    </ClientOnly>
  </div>
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
