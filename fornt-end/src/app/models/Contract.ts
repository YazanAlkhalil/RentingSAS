import {Apartment} from './Apartment';
import {Payment} from './Interfaces/Payment';
import Parse from 'parse';
export class Contract extends Parse.Object {
  constructor() {
    super('Contract');
  }

  get apartment(): Apartment {
    return this.get('Apartment');
  }

  set apartment(value: Apartment) {
    this.set('apartment', value);
  }

  get startDate(): Date {
    return this.get('startDate');
  }

  set startDate(value: Date) {
    this.set('startDate', value);
  }

  get endDate(): Date {
    return this.get('endDate');
  }

  set endDate(value: Date) {
    this.set('endDate', value);
  }

  get rentAmount(): string {
    return this.get('rentAmount');
  }

  set rentAmount(value: string) {
    this.set('rentAmount', value);
  }

  get paymentFrequency(): string {
    return this.get('paymentFrequency');
  }

  set paymentFrequency(value: string) {
    this.set('paymentFrequency', value);
  }

  get balance(): number {
    return this.get('balance');
  }

  set balance(value: number) {
    this.set('balance', value);
  }

  get deposit(): string {
    return this.get('deposit');
  }

  set deposit(value: string) {
    this.set('deposit', value);
  }

  get isExpired(): boolean {
    return this.get('isExpired');
  }

  set isExpired(value: boolean) {
    this.set('isExpired', value);
  }

  get additionalInfo(): string {
    return this.get('additionalInfo');
  }

  set additionalInfo(value: string) {
    this.set('additionalInfo', value);
  }
  
  get payments(): Payment[] {
    return this.get('payments');
  }

  set payments(value: Payment[]) {
    this.set('payments', value);
  }

  get maintenanceTerms(): string {
    return this.get('maintenanceTerms');
  }

  set maintenanceTerms(value: string) {
    this.set('maintenanceTerms', value);
  }

  get specialTerms(): string {
    return this.get('specialTerms');
  }

  set specialTerms(value: string) {
    this.set('specialTerms', value);
  }

  get utilitiesToPay(): string[] {
    return this.get('utilitiesToPay');
  }

  set utilitiesToPay(value: string[]) {
    this.set('utilitiesToPay', value);
  }
}

Parse.Object.registerSubclass('Contract', Contract);
