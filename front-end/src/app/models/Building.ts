import { Apartment } from "./Interfaces/Apartment";
import { Location } from "./Interfaces/Location";
import Parse from 'parse'
export class Building extends Parse.Object {
  constructor() {
    super('Building');
    this.set('location' , { longitude: '' , latitude: '' })
  }
  get company_id(): Parse.Pointer {
    return this.get('company_id');
  }

  set company_id(value: Parse.Pointer) {
    this.set('company_id', value);
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

  get location(): Location {
    return this.get('location');
  }

  set location(value: Location) {
    this.set('location', value);
  }

  get img(): Parse.File {
    return this.get('img');
  }

  set img(value: Parse.File) {
    this.set('img', value);
  }

  get apartment(): Apartment[] {
    return this.get('apartment');
  }

  set apartment(value: Apartment[]) {
    this.set('apartment', value);
  }
}

Parse.Object.registerSubclass('Building', Building);
