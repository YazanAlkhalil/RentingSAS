import {Apartment} from './Apartment';
import {Contract} from './Contract';

export class Payment extends Parse.Object {
  constructor() {
    super('Expenses');
  }
  get contract(): Contract {
    return this.get('contract');
  }
  set contract(value: Contract) {
    this.set('contract', value);
  }

  get dueDate(): Date {
    return this.get('dueDate');
  }

  set dueDate(value: Date) {
    this.set('dueDate', value);
  }
  get paidDate(): Date {
    return this.get('paidDate');
  }

  set paidDate(value: Date) {
    this.set('paidDate', value);
  }

  get amount(): number {
    return this.get('amount');
  }
  set amount(value: number) {
    this.set('amount', value);
  }

  get status(): string {
    return this.get('status');
  }
  set status(value: string) {
    this.set('status', value);
  }

  get description(): string {
    return this.get('description');
  }
  set description(value: string) {
    this.set('description', value);
  }

  get paymentMethod(): string {
    return this.get('paymentMethod');
  }

  set paymentMethod(value: string) {
    this.set('paymentMethod', value);
  }
  get transaction_id(): string {
    return this.get('transaction_id');
  }

  set transaction_id(value: string) {
    this.set('transaction_id', value);
  }
}
Parse.Object.registerSubclass('Payment', Payment);
