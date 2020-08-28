export default {
  /*
   * Nuxt rendering mode
   * See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   * Nuxt target
   * See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   * Headers of the page
   * See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   * Global CSS
   */
  css: ['@/assets/css/main.scss'],
  /*
   * Plugins to load before mounting the App
   * https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/global-axios', '@/plugins/store-initializer'],
  /*
   * Auto import components
   * See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   * Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   * Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    // Doc: https://auth.nuxtjs.org/
    '@nuxtjs/auth',
    // Doc: https://github.com/mazipan/vue-currency-filter
    'vue-currency-filter/nuxt',
  ],
  /*
   * Axios module configuration
   * See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   * Content module configuration
   * See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   * Build configuration
   * See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extractCSS: true,
  },
  /*
   * BootstrapVue configuration
   * See https://bootstrap-vue.org/docs
   */
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    componentPlugins: [
      'ButtonPlugin',
      'CardPlugin',
      'CollapsePlugin',
      'DropdownPlugin',
      'FormPlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'ImagePlugin',
      'JumbotronPlugin',
      'LayoutPlugin',
      'NavPlugin',
      'NavbarPlugin',
      'TablePlugin',
    ],
    directivePlugins: [],
  },
  /*
   * Auth module configuration
   * See https://auth.nuxtjs.org/api/options.html
   */
  auth: {
    redirect: {
      login: '/login',
      callback: '/login/callback',
    },
    strategies: {
      local: false,
      oauth2: {
        _scheme: 'oauth2',
        authorization_endpoint: process.env.OAUTH2_AUTHORIZE_ENDPOINT,
        userinfo_endpoint: process.env.OAUTH2_USERINFO_ENDPOINT,
        access_token_endpoint: process.env.OAUTH2_TOKEN_ENDPOINT,
        client_id: process.env.OAUTH2_CLIENT_ID,
        scope: (process.env.OAUTH2_SCOPES || 'openid,profile').split(','),
        token_type: 'Bearer',
        token_key: 'access_token',
        refresh_token_key: 'refresh_token',
      },
    },
  },
  /*
   * Currency filter configuration
   * See https://mazipan.github.io/vue-currency-filter/#/
   */
  currencyFilter: {
    symbol: '€',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'back',
    symbolSpacing: true,
  },
}
