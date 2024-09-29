import { ContactInfo } from "./Interfaces/ContactInfo";


export class Company extends Parse.Object {
  constructor() {
    super('Company');
  }

  get name(): string {
    return this.get('name');
  }

  set name(value: string) {
    this.set('name', value);
  }

  get address(): string {
    return this.get('address');
  }

  set address(value: string) {
    this.set('address', value);
  }

  get contactInfo(): ContactInfo {
    return this.get('contactInfo');
  }

  set contactInfo(value: ContactInfo) {
    this.set('contactInfo', value);
  }

  get img(): string {
    return this.get('img');
  }

  set img(value: string) {
    this.set('img', value);
  }
}

Parse.Object.registerSubclass('Company', Company);
