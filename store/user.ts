import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '@/plugins/global-axios'
import { CompanyInfo } from '@/types/user/company-info'

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {
  companyInfo: CompanyInfo | null = null

  @Mutation
  addCompanyInfoToState(companyInfo: CompanyInfo): void {
    this.companyInfo = companyInfo
  }

  @Action
  async getCompanyInfo(): Promise<CompanyInfo> {
    if (this.companyInfo) {
      return this.companyInfo
    }
    const companyInfo: CompanyInfo = await $axios.$get('/companyinfo')
    this.context.commit('addCompanyInfoToState', companyInfo)
    return companyInfo
  }
}
