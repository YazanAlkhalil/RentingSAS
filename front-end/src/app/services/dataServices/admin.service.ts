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
        return company.destroy()
    }

  getCompanies(data:{
    skip:number,
    limit:number,
    sortField:string,
    searchValue:string,
    withCount:boolean
  }): Promise<{ results: Company[]; count: number } | Company[] | any > {
    let query = new Query(Company);
    if(data.searchValue){
      const re = RegExp(`${data?.searchValue?.replace("+" , `\\+`).replace("-" , `\\-`)}`,"i")
      const descQuery = new Query(Company).matches('description',re)
      query = Query.or(descQuery)
    }
    query
    .descending(data.sortField)
    .skip(data.skip)
    .limit(data.limit)
    .descending('createdAt')
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

  getUsersByCompany(companyId: string): Promise<User[]> {
    
    const query = new Query(User);
    query.equalTo('company_id', companyId);
    return query.find();
  }

  addUser(InputUser: User): Promise<Parse.User> {
      const user = new Parse.User();

      user.set("username", InputUser.username);
      user.set("password",  InputUser.password);
      user.set("contactInfo", InputUser.contactInfo);
      user.set("company_id", InputUser.company_id);
      user.set("img", InputUser.img); 

      
    return user.signUp();
  }

  updateUser(user: User): Promise<User> {
    
    return user.save();
  }

  deleteUser(user: User): Promise<User> {
    
    return user.destroy();
  }
}