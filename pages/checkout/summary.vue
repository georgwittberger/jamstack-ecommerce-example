<template>
  <div>
    <h1>Checkout Summary</h1>
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
      <b-col cols="12" md="6" v-if="hasAdditionalInformation">
        <h2>Additional Information</h2>
        <p v-if="orderReferenceNumber">
          Order Reference Number: {{ orderReferenceNumber }}
        </p>
      </b-col>
    </b-row>
    <h2 class="checkout-summary__cart-heading">Cart</h2>
    <cart-items-table read-only />
    <p class="checkout-summary__total-price">
      Total Price: {{ totalPrice | currency }}
    </p>
    <p class="checkout-summary__legal-text">
      By placing an order you agree to our terms and conditions.
    </p>
    <div class="checkout-summary__buttons">
      <b-button variant="outline-secondary" to="/checkout/configuration">
        Back to Configuration
      </b-button>
      <b-button variant="primary" @click="placeOrder"> Place Order </b-button>
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
export default class CheckoutSummaryPage extends Vue {
  contactInfo: ContactInfo | null = null
  private cartModule = getModule(CartModule, this.$store)
  private userModule = getModule(UserModule, this.$store)

  get hasAdditionalInformation(): boolean {
    return this.orderReferenceNumber !== null
  }

  get orderReferenceNumber(): string | null {
    return this.cartModule.cartConfiguration.orderReferenceNumber || null
  }

  get totalPrice(): number {
    return this.cartModule.cartTotalPrice
  }

  head() {
    return { title: 'Checkout Summary' }
  }

  async created() {
    if (!this.cartModule.cartConfiguration.confirmed) {
      this.$router.replace('/checkout/configuration')
    }
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

  async placeOrder() {
    try {
      const { error } = await this.cartModule.placeOrder()
      if (!error) {
        this.$router.push('/checkout/confirmation')
      } else {
        if (error.isUnauthorized) {
          this.$auth.redirect('login')
        } else {
          console.error('Error transmitting order. ', error.message)
        }
      }
    } catch (error) {
      console.error('Error transmitting order. ', error)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-summary__cart-heading {
  margin-bottom: 1rem;
}
.checkout-summary__total-price {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
}
.checkout-summary__legal-text {
  text-align: right;
}
.checkout-summary__buttons {
  text-align: right;
}
</style>
