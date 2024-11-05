import { Company } from "./Company";
import { Location } from "./Interfaces/Location";
import Parse from "parse";
export class Building extends Parse.Object {
  constructor() {
    super('Building');
    this.set('location' , {longitude:'' , latitude:''})
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

  get isArchived(): boolean {
    return this.get('isArchived');
  }

  set isArchived(value: boolean) {
    this.set('isArchived', value);
  }

}

Parse.Object.registerSubclass('Building', Building);
