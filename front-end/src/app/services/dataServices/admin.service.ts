import { Injectable } from '@angular/core';
import {Building} from '../../models/Building'
import { Query } from 'parse';
import { Company } from '../../models/Company';
import { ContactInfo } from '../../models/Interfaces/ContactInfo';
import { User } from '../../models/_User'; 
import Parse from 'parse';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

    addCompany(data:{
        name:string,
        address:string,
        contactInfo:ContactInfo,
        skip:number,
        limit:number,
        img:Parse.File,
    }):Promise<Company>{
        const company = new Company()
        company.name = data.name
        company.address = data.address
        company.contactInfo = data.contactInfo
        company.img = data.img
        return company.save()
    }


    deleteCompany(company:Company):Promise<Company>{
        return Parse.Cloud.run('deleteCompany',{id:company.id})
    }

  getCompanies(data:{
    skip:number,
    limit:number,
    sortField:string,
    sortOrder:'asc' | 'desc',
    searchValue:string,
    withCount:boolean
  }): Promise<{ results: Company[]; count: number } | Company[] | any > {
    let query = new Query(Company);
    if(data.searchValue){
      const re = RegExp(`${data?.searchValue?.replace(/[+-.]/g, "\\$&")}`, "i");
      const nameQuery = new Query(Company).matches('name', re);
      const addressQuery = new Query(Company).matches('address', re);
      const emailQuery = new Query(Company).matches('contactInfo.email', re);
      const phoneQuery = new Query(Company).matches('contactInfo.phone', re);
      query = Query.or(nameQuery, addressQuery, emailQuery, phoneQuery);
    }
    if (data.sortField) {
      if (data.sortOrder === 'asc') {
        query.ascending(data.sortField);
      } else {
        query.descending(data.sortField);
      }
    } else {
      query.descending('createdAt');
    }
    query
    .skip(data.skip)
    .limit(data.limit)
    .include([
      'name',
      'address',
      'contactInfo',
      'img'
    ])
    if(data.withCount){
      query.withCount(true)
    }
    return query.find()
  }

  getUsersByCompany(companyId: Parse.Pointer): Promise<User[]> {
    const query = new Query(User);
    query.equalTo('company', companyId);
    return query.find();
  }

  addUser(InputUser: User): Promise<Parse.User> {
      const user = new Parse.User();

      user.set("username", InputUser.username);
      user.set("password",  InputUser.password);
      user.set("contactInfo", InputUser.contactInfo);
      user.set("company", InputUser.company);
      user.set("img", InputUser.img); 
    return user.save()
  }

  updateUser(user: User): Promise<User> {
    
    return user.save();
  }

  deleteUser(user: User): Promise<User> {
    
    return user.destroy();
  }
}