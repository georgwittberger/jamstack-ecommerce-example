<template>
  <div>
    <h1>My User Profile</h1>
    <h2>Personal Information</h2>
    <p>Name: {{ $auth.user.name }}</p>
    <p>E-Mail Address: {{ $auth.user.email }}</p>
    <p>Phone Number: {{ $auth.user.phone_number }}</p>
    <p v-if="$auth.user.address">
      Local Address:
      {{ $auth.user.address.street_address }},
      {{ $auth.user.address.postal_code }} {{ $auth.user.address.locality }},
      {{ $auth.user.address.country }}
    </p>
    <div v-if="contactInfo">
      <h2>Company Information</h2>
      <p>Name: {{ contactInfo.company.name }}</p>
      <p>Account Number: {{ contactInfo.company.number }}</p>
      <p>
        Billing Address: {{ contactInfo.company.billingAddress.street }},
        {{ contactInfo.company.billingAddress.postalCode }}
        {{ contactInfo.company.billingAddress.city }},
        {{ contactInfo.company.billingAddress.country }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserModule from '@/store/user'
import { ContactInfo } from '@/types/user/contact-info'

@Component({
  middleware: 'auth',
})
export default class UserProfilePage extends Vue {
  contactInfo: ContactInfo | null = null
  private userModule = getModule(UserModule, this.$store)

  head() {
    return { title: 'My User Profile' }
  }

  async created() {
    this.contactInfo = await this.userModule.getContactInfo()
  }
}
</script>

<style></style>
