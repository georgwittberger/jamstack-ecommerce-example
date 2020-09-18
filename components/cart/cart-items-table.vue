<template>
  <b-table :fields="tableColumns" :items="cartItems" responsive="sm" hover>
    <template v-slot:cell(productName)="data">
      <nuxt-link
        :to="`/products/${data.item.categorySlug}/${data.item.productSlug}`"
        v-if="!readOnly"
      >
        {{ data.item.productName }}
      </nuxt-link>
      <span v-if="readOnly">{{ data.item.productName }}</span>
    </template>
    <template v-slot:cell(productNumber)="data">
      {{ data.item.productSku }}
    </template>
    <template v-slot:cell(quantity)="data">
      <b-form-input
        type="number"
        number
        size="sm"
        :value="data.item.quantity"
        @update="updateCartItemQuantity(data.item, $event)"
        v-if="!readOnly"
      ></b-form-input>
      <span v-if="readOnly">{{ data.item.quantity }}</span>
    </template>
    <template v-slot:cell(totalPrice)="data">
      {{ data.item.totalPrice | currency }}
    </template>
    <template v-slot:cell(actions)="data">
      <b-button
        size="sm"
        variant="outline-secondary"
        @click="removeCartItem(data.item)"
      >
        Remove
      </b-button>
    </template>
  </b-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CartModule from '@/store/cart'
import { CartItem } from '@/types/cart/cart-item'

@Component
export default class CartItemsTable extends Vue {
  @Prop(Boolean) readOnly!: boolean
  private cartModule = getModule(CartModule, this.$store)

  get tableColumns() {
    const tableColumns = [
      { key: 'productName', label: 'Product Name' },
      { key: 'productNumber', label: 'Product Number' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'totalPrice', label: 'Total Price' },
    ]
    if (!this.readOnly) {
      tableColumns.push({ key: 'actions', label: 'Actions' })
    }
    return tableColumns
  }

  get cartItems() {
    return this.cartModule.cartItems
  }

  updateCartItemQuantity(item: CartItem, quantity: number) {
    this.cartModule.updateCartItem({ cartItemId: item.id, quantity })
  }

  removeCartItem(item: CartItem) {
    this.cartModule.removeCartItem(item.id)
  }
}
</script>

<style></style>
