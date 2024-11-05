import {Building} from './Building';

export class Apartment extends Parse.Object {
  constructor() {
    super('Apartment');
  }
  get building(): Building {
    return this.get('building');
  }
  set building(value: Building) {
    this.set('building', value);
  }
  get number(): number {
    return this.get('number');
  }
  set number(value: number) {
    this.set('number', value);
  }
  get name(): string {
    return this.get('name');
  }
  set name(value: string) {
    this.set('name', value);
  }
  get floor(): number {
    return this.get('floor');
  }
  set floor(value: number) {
    this.set('floor', value);
  }
  set owner(value:string){
    this.set('owner',value)
  }
  get owner():string{
    return this.get('owner')
  }
  get size(): number {
    return this.get('size');
  }
  set size(value: number) {
    this.set('size', value);
  }
  get bedroom(): number {
    return this.get('bedroom');
  }
  set bedroom(value: number) {
    this.set('bedroom', value);
  }
  get bathroom(): number {
    return this.get('bathroom');
  }
  set bathroom(value: number) {
    this.set('bathroom', value);
  }
  get rentPrice(): number {
    return this.get('rentPrice');
  }
  set rentPrice(value: number) {
    this.set('rentPrice', value);
  }
  get amenities(): string[] {
    return this.get('amenities');
  }
  set amenities(value: string[]) {
    this.set('amenities', value);
  }
  get isFurnished(): boolean {
    return this.get('isFurnished');
  }
  set isFurnished(value: boolean) {
    this.set('isFurnished', value);
  }

  //status: out of service, occupied, vacant
  get status(): string {
    return this.get('status');
  }
  set status(value: string) {
    this.set('status', value);
  }

  //type: Residential,Commercial
  get type():string{
    return this.get('type')
  }
  set type(value:string){
    this.set('type',value)
  }
  get description(): string {
    return this.get('description');
  }
  set description(value: string) {
    this.set('description', value);
  }
  get imgs(): Parse.File[] {
    return this.get('imgs');
  }
  set imgs(value: Parse.File[]) {
    this.set('imgs', value);
  }
  get isArchived(): boolean {
    return this.get('isArchived');
  }
  set isArchived(value: boolean) {
    this.set('isArchived', value);
  }

  set paymentType(value:string){
    this.set('paymentType',value)
  }
  get paymentType():string{
    return this.get('paymentType')
  }

  set frequency(value:string){
    this.set('frequency',value)
  }
  get frequency():string{
    return this.get('frequency')
  }

  set lastOccupiedDate(value:Date){
    this.set('lastOccupiedDate',value)
  }
  get lastOccupiedDate():Date{
    return this.get('lastOccupiedDate')
  }

  set statusCode(value:string){
    this.set('statusCode',value)
  }
  get statusCode():string{
    return this.get('statusCode')
  }
}
Parse.Object.registerSubclass('Apartment',Apartment)