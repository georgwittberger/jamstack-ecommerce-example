<template>
  <div>
    <h1>Checkout Configuration</h1>
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
    <h2>Additional Information</h2>
    <b-form>
      <b-form-group
        label="Order Reference Number"
        label-for="orderReferenceNumber"
      >
        <b-form-input
          id="orderReferenceNumber"
          aria-describedby="orderReferenceNumberInvalid"
          debounce="300"
          v-model="orderReferenceNumber"
          :state="orderReferenceNumberState"
        ></b-form-input>
        <b-form-invalid-feedback id="orderReferenceNumberInvalid">
          The value can be at most 80 characters.
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form>
    <div>
      <b-button
        variant="primary"
        :disabled="isConfigurationInvalid"
        @click="continueToSummary"
      >
        Continue to Summary
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
export default class CheckoutConfigurationPage extends Vue {
  companyInfo: CompanyInfo | null = null
  private cartModule = getModule(CartModule, this.$store)
  private userModule = getModule(UserModule, this.$store)

  get orderReferenceNumber(): string {
    return this.cartModule.cartConfiguration.orderReferenceNumber || ''
  }

  set orderReferenceNumber(value) {
    this.cartModule.updateCartConfiguration({ orderReferenceNumber: value })
  }

  get orderReferenceNumberState(): boolean | null {
    return this.orderReferenceNumber
      ? this.orderReferenceNumber.length <= 80
      : null
  }

  get isConfigurationInvalid(): boolean {
    return this.orderReferenceNumberState === false
  }

  head() {
    return { title: 'Checkout Configuration' }
  }

  async created() {
    this.companyInfo = await this.userModule.getCompanyInfo()
  }

  continueToSummary() {
    this.$router.push('checkout/summary')
  }
}
</script>

<style></style>
