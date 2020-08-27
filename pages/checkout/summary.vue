<template>
  <div>
    <h1>Checkout Summary</h1>
    <h2>Contact Information</h2>
    <p>The following information will be used for communication.</p>
    <p>Contact Person: {{ $auth.user.name }}</p>
    <p>E-Mail Address: {{ $auth.user.email }}</p>
    <h2>Shipping and Billing</h2>
    <b-row v-if="companyInfo">
      <b-col cols="12" md="6">
        <p>The order will be shipped to the following address.</p>
        <p>
          {{ companyInfo.name }}<br />
          {{ companyInfo.billingAddress.street }}<br />
          {{ companyInfo.billingAddress.postalCode }}
          {{ companyInfo.billingAddress.city }}<br />
          {{ companyInfo.billingAddress.country }}
        </p>
      </b-col>
      <b-col cols="12" md="6">
        <p>The invoice for the order will be sent to the following address.</p>
        <p>
          {{ companyInfo.name }}<br />
          {{ companyInfo.billingAddress.street }}<br />
          {{ companyInfo.billingAddress.postalCode }}
          {{ companyInfo.billingAddress.city }}<br />
          {{ companyInfo.billingAddress.country }}
        </p>
      </b-col>
    </b-row>
    <h2>Payment</h2>
    <p>The order will be paid via invoice.</p>
    <div v-if="hasAdditionalInformation">
      <h2>Additional Information</h2>
      <p v-if="orderReferenceNumber">
        Order Reference Number: {{ orderReferenceNumber }}
      </p>
    </div>
    <div>
      <p>By placing an order you agree to our terms and conditions.</p>
      <b-button variant="primary" @click="placeOrder">
        Place Order
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'
import UserModule from '@/store/user'
import { CompanyInfo } from '@/types/user/company-info'

@Component({
  middleware: 'auth',
})
export default class CheckoutSummaryPage extends Vue {
  companyInfo: CompanyInfo | null = null
  private cartModule = getModule(CartModule, this.$store)
  private userModule = getModule(UserModule, this.$store)

  get hasAdditionalInformation(): boolean {
    return this.orderReferenceNumber !== null
  }

  get orderReferenceNumber(): string | null {
    return this.cartModule.cartConfiguration.orderReferenceNumber || null
  }

  head() {
    return { title: 'Checkout Summary' }
  }

  async created() {
    this.companyInfo = await this.userModule.getCompanyInfo()
  }

  placeOrder() {}
}
</script>

<style></style>
