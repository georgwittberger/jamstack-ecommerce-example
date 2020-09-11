import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '@/plugins/global-axios'
import { ApiError } from '@/types/api-error'
import { ContactInfo } from '@/types/user/contact-info'

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {
  contactInfo: ContactInfo | null = null

  @Mutation
  addContactInfoToState(contactInfo: ContactInfo): void {
    this.contactInfo = contactInfo
  }

  @Action
  async getContactInfo(): Promise<ContactInfoResult> {
    if (this.contactInfo) {
      return { data: this.contactInfo }
    }
    try {
      const contactInfo: ContactInfo = await $axios.$get('/contactinfo')
      this.context.commit('addContactInfoToState', contactInfo)
      return { data: contactInfo }
    } catch (error) {
      return {
        error: new ApiError(
          error?.response?.status || 0,
          error?.response?.data?.error || 'Unknown error'
        ),
      }
    }
  }
}

type ContactInfoResult = { data?: ContactInfo; error?: ApiError }
