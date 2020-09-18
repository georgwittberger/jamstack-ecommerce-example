import axios, { AxiosRequestConfig } from 'axios'
import querystring from 'querystring'
import log from './logger'

export async function getAccessToken(): Promise<string> {
  if (!process.env.SALESFORCE_TOKEN_ENDPOINT) {
    throw new Error(
      'No token endpoint defined. Please set environment variable SALESFORCE_TOKEN_ENDPOINT'
    )
  }

  const authenticationRequestParams = {
    grant_type: 'password',
    client_id: process.env.SALESFORCE_CLIENT_ID,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET,
    username: process.env.SALESFORCE_USERNAME,
    password: process.env.SALESFORCE_PASSWORD,
  }

  log.info('Requesting Salesforce access token...')
  const { data } = await axios.post(
    process.env.SALESFORCE_TOKEN_ENDPOINT,
    querystring.stringify(authenticationRequestParams),
    { headers: { Accept: 'application/json' } }
  )

  if (!data?.access_token) {
    throw new Error('Authentication request did not return any access token')
  }

  log.info('Salesforce access token received.')
  return data.access_token
}

export async function executeSoqlQuery(
  soqlQuery: string,
  accessToken: string
): Promise<any> {
  const request: AxiosRequestConfig = {
    url: `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v${process.env.SALESFORCE_API_VERSION}/query`,
    method: 'get',
    params: {
      q: soqlQuery,
    },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }
  log.debug('Executing SOQL query: %s', [soqlQuery])
  const { data } = await axios.request(request)
  return data
}
