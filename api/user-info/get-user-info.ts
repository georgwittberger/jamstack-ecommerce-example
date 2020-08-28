import axios from 'axios'
import { UserInfo } from '../salesforce/types'

export async function getUserInfo(authorization: string): Promise<UserInfo> {
  const endpoint = process.env.SALESFORCE_USERINFO_ENDPOINT
  if (!endpoint) {
    throw new Error(
      'No user info endpoint defined. Please set environment variable SALESFORCE_USERINFO_ENDPOINT'
    )
  }
  const { data } = await axios.get(endpoint, {
    headers: {
      Accept: 'application/json',
      Authorization: authorization,
    },
  })
  return data
}
