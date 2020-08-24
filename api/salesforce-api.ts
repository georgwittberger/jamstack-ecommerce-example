import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import querystring from 'querystring'

let accessToken: string

export async function connectToSalesforce(): Promise<void> {
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
  const { data } = await axios.post(
    process.env.SALESFORCE_TOKEN_ENDPOINT,
    querystring.stringify(authenticationRequestParams),
    { headers: { Accept: 'application/json' } }
  )
  if (!data?.access_token) {
    throw new Error('Authentication did not return any access token')
  }
  accessToken = data.access_token
}

export async function executeRequest(
  request: AxiosRequestConfig
): Promise<AxiosResponse<any>> {
  let response: AxiosResponse<any> | null = null
  try {
    response = await performAuthorizedRequest(request)
  } catch (error) {
    if (error.response?.status === 401) {
      await connectToSalesforce()
    } else {
      throw new Error(`Salesforce API request failed: ${error.message}`)
    }
  }
  if (!response) {
    try {
      response = await performAuthorizedRequest(request)
    } catch (error) {
      throw new Error(
        `Retry of Salesforce API request failed: ${error.message}`
      )
    }
  }
  return response
}

function performAuthorizedRequest(
  request: AxiosRequestConfig
): Promise<AxiosResponse<any>> {
  const headers: any = request.headers || {}
  headers.Authorization = `Bearer ${accessToken}`
  return axios.request(request)
}

export async function executeSoqlQuery(soqlQuery: string): Promise<any> {
  const request: AxiosRequestConfig = {
    url: `${process.env.SALESFORCE_INSTANCE_URL}/services/data/v${process.env.SALESFORCE_API_VERSION}/query`,
    method: 'get',
    params: {
      q: soqlQuery,
    },
    headers: { Accept: 'application/json' },
  }
  const { data } = await executeRequest(request)
  return data
}
