export interface CompanyInfo {
  name: string
  number: string
  billingAddress: {
    street: string
    postalCode: string
    city: string
    country: string
  }
}
