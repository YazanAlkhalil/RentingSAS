import { Company } from './Company';
import Parse from 'parse';

export class Client extends Parse.Object {
  constructor() {
    super('Client');
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
  get phone(): number {
    return this.get('phone');
  }
  set phone(value: number) {
    this.set('phone', value);
  }
  get img(): Parse.File {
    return this.get('img');
  }
  set img(value: Parse.File) {
    this.set('img', value);
  }

  //status: Active,pending,Blocked,Former

  set status(value:string){
    this.set('status',value)
  }
  get status():string{
    return this.get('status')
  }

  set statusCode(value:string){
    this.set('statusCode',value)
  }
  get statusCode():string{
    return this.get('statusCode')
  }

  set isArchived(value:boolean){
    this.set('isArchived',value)
  }
  get isArchived():boolean{
    return this.get('isArchived')
  }
}
Parse.Object.registerSubclass('Client' , Client)