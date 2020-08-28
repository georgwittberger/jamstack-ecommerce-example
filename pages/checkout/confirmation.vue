<template>
  <div>
    <h1>Checkout Confirmation</h1>
    <p class="checkout-confirmation__message">
      Your order has been placed successfully.
    </p>
    <p class="checkout-confirmation__order-number">
      Order Number: {{ orderNumber }}
    </p>
    <b-button variant="primary" @click="navigateToHomePage">
      Back to Home Page
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component({
  middleware: 'auth',
})
export default class CheckoutConfirmationPage extends Vue {
  private cartModule = getModule(CartModule, this.$store)

  get orderNumber(): string {
    return this.cartModule.recentOrderNumber
  }

  head() {
    return { title: 'Checkout Confirmation' }
  }

  created() {
    if (!this.orderNumber) {
      this.navigateToHomePage()
    }
  }

  navigateToHomePage() {
    this.$router.replace('/')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables';

.checkout-confirmation__message {
  color: $success;
  font-size: 1.2rem;
  font-weight: bold;
}
.checkout-confirmation__order-number {
  margin-bottom: 2rem;
}
</style>
