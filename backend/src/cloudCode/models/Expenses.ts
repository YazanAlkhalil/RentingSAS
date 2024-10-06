import {Apartment} from './Apartment';

export class Expenses extends Parse.Object {
  constructor() {
    super('Expenses');
  }
  get apartment(): Apartment {
    return this.get('apartment');
  }
  set apartment(value: Apartment) {
    this.set('apartment', value);
  }

  get type(): string {
    return this.get('type');
  }
  set type(value: string) {
    this.set('type', value);
  }

  get value(): number {
    return this.get('value');
  }
  set value(value: number) {
    this.set('value', value);
  }

  get description(): string {
    return this.get('description');
  }
  set description(value: string) {
    this.set('description', value);
  }
}
Parse.Object.registerSubclass('Expenses', Expenses);
