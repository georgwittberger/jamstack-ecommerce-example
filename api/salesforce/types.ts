export type UserInfo = {
  sub: string
  user_id: string
  organization_id: string
  preferred_username: string
  nickname: string
  name: string
  email: string
  email_verified: boolean
  phone_number: string
  given_name: string
  family_name: string
  zoneinfo: string
  photos: {
    picture: string
    thumbnail: string
  }
  profile: string
  picture: string
  address: {
    street_address: string
    postal_code: string
    locality: string
    country: string
  }
  urls: any
  active: boolean
  user_type: string
  language: string
  locale: string
  utcOffset: number
  updated_at: string
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
