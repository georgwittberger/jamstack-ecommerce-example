<template>
  <div>
    <h1>Checkout Configuration</h1>
    <h2>Contact Information</h2>
    <p>The following information will be used for communication.</p>
    <p>Contact Person: {{ $auth.user.name }}</p>
    <p>E-Mail Address: {{ $auth.user.email }}</p>
    <h2>Shipping and Billing</h2>
    <b-row v-if="contactInfo">
      <b-col cols="12" md="6">
        <p>The order will be shipped to the following address.</p>
        <p>
          {{ contactInfo.company.name }}<br />
          {{ contactInfo.company.billingAddress.street }}<br />
          {{ contactInfo.company.billingAddress.postalCode }}
          {{ contactInfo.company.billingAddress.city }}<br />
          {{ contactInfo.company.billingAddress.country }}
        </p>
      </b-col>
      <b-col cols="12" md="6">
        <p>The invoice for the order will be sent to the following address.</p>
        <p>
          {{ contactInfo.company.name }}<br />
          {{ contactInfo.company.billingAddress.street }}<br />
          {{ contactInfo.company.billingAddress.postalCode }}
          {{ contactInfo.company.billingAddress.city }}<br />
          {{ contactInfo.company.billingAddress.country }}
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="6">
        <h2>Payment</h2>
        <p>The order will be paid via invoice.</p>
      </b-col>
      <b-col cols="12" md="6">
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
      </b-col>
    </b-row>
    <div class="checkout-configuration__buttons">
      <b-button variant="outline-secondary" to="/cart">Back to Cart</b-button>
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
import { ContactInfo } from '@/types/user/contact-info'

@Component({
  middleware: 'auth',
})
export default class CheckoutConfigurationPage extends Vue {
  contactInfo: ContactInfo | null = null
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
    try {
      const { data, error } = await this.userModule.getContactInfo()
      if (data) {
        this.contactInfo = data
      } else if (error) {
        if (error.isUnauthorized) {
          this.$auth.redirect('login')
        } else {
          console.error('Error loading contact info. ', error.message)
        }
      }
    } catch (error) {
      console.error('Error loading contact info. ', error)
    }
  }

  continueToSummary() {
    this.cartModule.updateCartConfiguration({ confirmed: true })
    this.$router.push('/checkout/summary')
  }
}
</script>

<style lang="scss" scoped>
.checkout-configuration__buttons {
  margin-top: 2rem;
  text-align: right;
}
</style>
