<template>
  <div>
    <h1>Login</h1>
    <p>Please authenticate with your Salesforce user account.</p>
    <div>
      <button @click="loginWithSalesforce" class="btn btn-primary">
        Login with Salesforce
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

  loginWithSalesforce() {
    this.$auth.loginWith('salesforce')
  }
}
</script>

<style></style>
