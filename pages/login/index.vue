<template>
  <div>
    <h1>Login</h1>
    <p>Logging in enables you to access personal areas and to place orders.</p>
    <div>
      <button @click="loginWithOauth2" class="btn btn-primary">
        Continue to Login
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LoginPage extends Vue {
  head() {
    return { title: 'Login' }
  }

  loginWithOauth2() {
    this.$auth.loginWith('oauth2')
  }
}
</script>

<style></style>
