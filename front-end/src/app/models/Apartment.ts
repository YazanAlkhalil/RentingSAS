import {Building} from './Building';
import Parse from 'parse';
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
  get imgs(): Parse.File[] {
    return this.get('imgs');
  }
  set imgs(value: Parse.File[]) {
    this.set('imgs', value);
  }
}
Parse.Object.registerSubclass('Apartment',Apartment)