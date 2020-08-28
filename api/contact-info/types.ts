export type ContactInfo = {
  person: {
    id: string
    firstName?: string
    lastName: string
  }
  company: {
    id: string
    name: string
    number?: string
    billingAddress: {
      street?: string
      postalCode?: string
      city?: string
      country?: string
    }
  }
}
