<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'

@Component({
  middleware: 'auth',
})
export default class LogoutPage extends Vue {
  private cartModule = getModule(CartModule, this.$store)

  created() {
    if (!sessionStorage.getItem('app.logout.intent')) return
    sessionStorage.removeItem('app.logout.intent')
    this.cartModule.clearCartItems()
    this.$auth.logout()
  }
}
</script>

<style></style>
