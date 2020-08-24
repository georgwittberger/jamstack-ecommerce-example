<template>
  <div>
    <h1>My User Profile</h1>
    <h2>Your User</h2>
    <p>Name: {{ $auth.user.name }}</p>
    <p>E-Mail Address: {{ $auth.user.email }}</p>
    <p>Phone Number: {{ $auth.user.phone_number }}</p>
    <p v-if="$auth.user.address">
      Local Address:
      {{ $auth.user.address.street_address }},
      {{ $auth.user.address.postal_code }} {{ $auth.user.address.locality }},
      {{ $auth.user.address.country }}
    </p>
    <div v-if="companyInfo">
      <h2>Your Company</h2>
      <p>Name: {{ companyInfo.name }}</p>
      <p>Account Number: {{ companyInfo.number }}</p>
      <p>
        Billing Address: {{ companyInfo.billingAddress.street }},
        {{ companyInfo.billingAddress.postalCode }}
        {{ companyInfo.billingAddress.city }},
        {{ companyInfo.billingAddress.country }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserModule, { CompanyInfo } from '@/store/user'

@Component({
  middleware: 'auth',
})
export default class UserProfilePage extends Vue {
  companyInfo: CompanyInfo | null = null
  private userModule = getModule(UserModule, this.$store)

  head() {
    return { title: 'My User Profile' }
  }

  async created() {
    this.companyInfo = await this.userModule.getCompanyInfo()
  }
}
</script>

<style></style>
