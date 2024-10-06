import { Company } from "./Company";
import { ContactInfo } from "./Interfaces/ContactInfo";
import Parse from "parse";
export class User extends Parse.User {
  constructor() {
    super({ className: 'User' });

    this.set('contactInfo', { phone: '', email: '' });
  }

  get company(): Company {
    return this.get('company');
  }

  set company(value: Company) {
    this.set('company', value);
  }

  get username(): string {
    return this.get('username');
  }

  set username(value: string) {
    this.set('username', value);
  }

  get password(): string {
    return this.get('password');
  }

  set password(value: string) {
    this.set('password', value);
  }

  get role(): string {
    return this.get('role');
  }

  set role(value: string) {
    this.set('role', value);
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

Parse.Object.registerSubclass('User', User);
