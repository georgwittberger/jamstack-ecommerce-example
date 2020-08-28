<template>
  <div>
    <h1>My User Profile</h1>
    <b-row>
      <b-col cols="12" md="6">
        <h2>Personal Information</h2>
        <p>Name: {{ $auth.user.name }}</p>
        <p>E-Mail Address: {{ $auth.user.email }}</p>
        <p>Phone Number: {{ $auth.user.phone_number }}</p>
        <p v-if="$auth.user.address">
          Local Address:<br />
          {{ $auth.user.address.street_address }}<br />
          {{ $auth.user.address.postal_code }}
          {{ $auth.user.address.locality }}<br />
          {{ $auth.user.address.country }}
        </p>
      </b-col>
      <b-col cols="12" md="6" v-if="contactInfo">
        <h2>Company Information</h2>
        <p>Name: {{ contactInfo.company.name }}</p>
        <p>Account Number: {{ contactInfo.company.number }}</p>
        <p>
          Billing Address:<br />
          {{ contactInfo.company.billingAddress.street }}<br />
          {{ contactInfo.company.billingAddress.postalCode }}
          {{ contactInfo.company.billingAddress.city }}<br />
          {{ contactInfo.company.billingAddress.country }}
        </p>
      </b-col>
    </b-row>
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
