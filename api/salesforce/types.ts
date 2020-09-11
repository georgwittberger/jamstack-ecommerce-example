export type UserInfo = {
  user_id: string
  preferred_username: string
  name: string
  given_name?: string
  family_name: string
  nickname?: string
  email?: string
  email_verified?: boolean
  phone_number?: string
  phone_number_verified?: boolean
  zoneinfo: string
  picture?: string
  address?: {
    street_address?: string
    postal_code?: string
    locality?: string
    country?: string
  }
  locale: string
}

export type SoqlQueryResult<T> = {
  done: boolean
  totalSize: number
  records?: T[]
}

export type InsertOrderResult = {
  done: boolean
  totalSize: number
  records?: InsertOrderRecord[]
}

type InsertOrderRecord = {
  Id: string
  OrderItems?: {
    done: boolean
    totalSize: number
    records?: {
      Id: string
    }[]
  }
}
