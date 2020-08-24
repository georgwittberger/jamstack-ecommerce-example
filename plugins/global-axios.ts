import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

let $axios: NuxtAxiosInstance

const globalAxiosPlugin: Plugin = (context) => {
  $axios = context.$axios
}

export { globalAxiosPlugin as default, $axios }
