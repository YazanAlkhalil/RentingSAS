import { Contract } from "./Contract";
import Parse from "parse";
export class Payment extends Parse.Object {
  constructor() {
    super("Payment");
  }
  get contract(): Contract {
    return this.get("contract");
  }
  set contract(value: Contract) {
    this.set("contract", value);
  }

  get dueDate(): Date {
    return this.get("dueDate");
  }

  set dueDate(value: Date) {
    this.set("dueDate", value);
  }
  get paidDate(): Date {
    return this.get("paidDate");
  }

  set paidDate(value: Date) {
    this.set("paidDate", value);
  }

  set isPaid(value: boolean) {
    this.set('isPaid', value)
  }
  get isPaid(): boolean {
    return this.get('isPaid')
  }

  get amount(): number {
    return this.get("amount");
  }
  set amount(value: number) {
    this.set("amount", value);
  }
  get paidAmount(): number {
    return this.get('paidAmount');
  }
  set paidAmount(value: number) {
    this.set('paidAmount', value);
  }
  
  //status: paid,upcoming,due,overdue,
  get status(): string {
    return this.get("status");
  }
  set status(value: string) {
    this.set("status", value);
  }
  set isPartiallyPaid(value: boolean) {
    this.set('isPartiallyPaid', value)
  }

  get statusCode(): string {
    return this.get('statusCode');
  }
  set statusCode(value: string) {
    this.set('statusCode', value);
  }

  get isPartiallyPaid(): boolean {
    return this.get('isPartiallyPaid')
  }
  get description(): string {
    return this.get("description");
  }
  set description(value: string) {
    this.set("description", value);
  }
  set currency(value: string) {
    this.set("currency", value);
  }
  get currency(): string {
    return this.get("currency");
  }
  set paymentMethod(value: string) {
    this.set("paymentMethod", value);
  }
  get paymentMethod(): string {
    return this.get("paymentMethod");
  }
  get transactionId(): string {
    return this.get("transactionId");
  }
  set transactionId(value: string) {
    this.set("transactionId", value);
  }
  set isArchived(value: boolean) {
    this.set('isArchived', value)
  }
  get isArchived(): boolean {
    return this.get('isArchived')
  }
}
Parse.Object.registerSubclass("Payment", Payment);
