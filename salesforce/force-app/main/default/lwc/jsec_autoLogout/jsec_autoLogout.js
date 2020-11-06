import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Jsec_autoLogout extends NavigationMixin(LightningElement) {
  renderedCallback() {
    this[NavigationMixin.Navigate]({
      type: 'comm__loginPage',
      attributes: {
        actionName: 'logout'
      }
    });
  }
}
