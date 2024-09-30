import { ContactInfo } from "./Interfaces/ContactInfo";
import Parse from "parse";
export class User extends Parse.User {
  constructor() {
    super({ className: 'User' });
  }

  get company_id(): Parse.Pointer {
    return this.get('company_id');
  }

  set company_id(value: Parse.Pointer) {
    this.set('company_id', value);
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
}

Parse.Object.registerSubclass('User', User);
