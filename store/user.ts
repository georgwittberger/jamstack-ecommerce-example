import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '@/plugins/global-axios'
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
  async getContactInfo(): Promise<ContactInfo> {
    if (this.contactInfo) {
      return this.contactInfo
    }
    const contactInfo: ContactInfo = await $axios.$get('/contactinfo')
    this.context.commit('addContactInfoToState', contactInfo)
    return contactInfo
  }
}
