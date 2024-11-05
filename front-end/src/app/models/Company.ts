import { ContactInfo } from "./Interfaces/ContactInfo";
import  Parse  from "parse";

export class Company extends Parse.Object {
  constructor() {
    super('Company');
    this.contactInfo = {email: '', phone: ''}
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


  
  get img(): Parse.File {
    return this.get('img');
  }

  set img(value: Parse.File) {
    this.set('img', value);
  }

  get currency(): string {
    return this.get('currency');
  }

  set currency(value: string) {
    this.set('currency', value);
  }
}

Parse.Object.registerSubclass('Company', Company);
