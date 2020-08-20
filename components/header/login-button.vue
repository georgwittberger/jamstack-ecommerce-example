<template>
  <nuxt-link to="/login" class="btn btn-secondary">Login</nuxt-link>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LoginButton extends Vue {}
</script>

<style></style>
