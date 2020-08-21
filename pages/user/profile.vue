<template>
  <div>
    <h1>My User Profile</h1>
    <p>Name: {{ $auth.user.name }}</p>
    <p>E-Mail Address: {{ $auth.user.email }}</p>
    <p>Phone Number: {{ $auth.user.phone_number }}</p>
    <p v-if="$auth.user.address">
      Local Address:
      {{ $auth.user.address.street_address }},
      {{ $auth.user.address.postal_code }} {{ $auth.user.address.locality }},
      {{ $auth.user.address.country }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  middleware: 'auth',
})
export default class UserProfilePage extends Vue {
  head() {
    return { title: 'My User Profile' }
  }
}
</script>

<style></style>
