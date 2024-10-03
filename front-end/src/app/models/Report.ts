import Parse from 'parse';

export class Report extends Parse.Object {
  constructor() {
    super('Report');
  }

  get company_name(): string {
    return this.get('company_name');
  }

  set company_name(value: string) {
    this.set('company_name', value);
  }

  get building_name(): string {
    return this.get('building_name');
  }

  set building_name(value: string) {
    this.set('building_name', value);
  }

  get apartment_name(): string {
    return this.get('apartment_name');
  }

  set apartment_name(value: string) {
    this.set('apartment_name', value);
  }

  get user_name(): string {
    return this.get('user_name');
  }

  set user_name(value: string) {
    this.set('user_name', value);
  }

  get action(): string {
    return this.get('action');
  }

  set action(value: string) {
    this.set('action', value);
  }

  get date(): Date {
    return this.get('date');
  }

  set date(value: Date) {
    this.set('date', value);
  }
}

Parse.Object.registerSubclass('Report', Report);
