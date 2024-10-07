import {Contract} from './Contract';
import {ContactInfo} from './Interfaces/ContactInfo';
import { Company } from './Company';

export class Client extends Parse.Object {
  constructor() {
    super('Client');
  }
  get contract(): Contract {
    return this.get('contract');
  }
  set contract(value: Contract) {
    this.set('contract', value);
  }
  get company(): Company {
    return this.get('company');
  }
  set company(value: Company) {
    this.set('company', value);
  }
  get name(): string {
    return this.get('name');
  }
  set name(value: string) {
    this.set('name', value);
  }
  get contactInfo(): ContactInfo {
    return this.get('contactInfo');
  }
  set contactInfo(value: ContactInfo) {
    this.set('contactInfo', value);
  }
  get img(): Parse.File {
    return this.get('img');
  }
  set img(value: Parse.File) {
    this.set('img', value);
  }
}
