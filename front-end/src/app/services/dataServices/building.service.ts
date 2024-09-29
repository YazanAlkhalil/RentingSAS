import { Injectable } from '@angular/core';
import {Building} from '../../models/Building'
import { Query } from 'parse';
@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor() { }
  getBuildings(data:{
    skip:number,
    limit:number,
    sortField:string,
    searchValue:string,
    withCount:boolean
  }): Promise<{ results: Building[]; count: number } | Building[] | any > {
    let query = new Query(Building);
    if(data.searchValue){
      const re = RegExp(`${data?.searchValue?.replace("+" , `\\+`).replace("-" , `\\-`)}`,"i")
      const descQuery = new Query(Building).matches('description',re)
      query = Query.or(descQuery)
    }
    query
    .descending(data.sortField)
    .skip(data.skip)
    .limit(data.limit)
    .descending('createdAt')
    .include([
      'company_id',
      'name',
      'address',
      'location',
      'img',
      'apartment'
    ])
    if(data.withCount){
      query.withCount(true)
    }
    return query.find()
  }
}
  