<template>
  <ul>
    <li>Logged in as: {{ $auth.user.name }}</li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class UserMenu extends Vue {}
</script>

<style></style>
