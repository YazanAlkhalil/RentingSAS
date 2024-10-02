import Parse from 'parse';

export class Report extends Parse.Object {
  constructor() {
    super('Report');
  }

  get company_id(): Parse.Pointer {
    return this.get('company_id');
  }

  set company_id(value: Parse.Pointer) {
    this.set('company_id', value);
  }

  get building_id(): Parse.Pointer {
    return this.get('building_id');
  }

  set building_id(value: Parse.Pointer) {
    this.set('building_id', value);
  }

  get apartment_id(): Parse.Pointer {
    return this.get('apartment_id');
  }

  set apartment_id(value: Parse.Pointer) {
    this.set('apartment_id', value);
  }

  get user_id(): Parse.Pointer {
    return this.get('user_id');
  }

  set user_id(value: Parse.Pointer) {
    this.set('user_id', value);
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
