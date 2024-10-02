import { Injectable } from '@angular/core';
import {Building} from '../../models/Building'
import { Pointer, Query } from 'parse';
import { Apartment } from '../../models/Interfaces/Apartment';
@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor( ) { }
  getBuildings(data: {
    skip: number,
    limit: number,
    sortField: string,
    searchValue: string,
    withCount: boolean,
    company_id:Pointer
  }): Promise<Building[]> {
  
    let query = new Query(Building);
  
    if (data.searchValue) {
      const re = RegExp(`${data?.searchValue?.replace("+", "\\+").replace("-", "\\-")}`, "i");
      const descQuery = new Query(Building).matches('description', re);
      query = Query.or(descQuery);
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
      ]);
  
    if (data.withCount) {
      query.withCount(true)
  }
  return query.find()
}
  async addBuilding(data:{
    name:string,
    company_id:Pointer,
    address:string,
    location:{ 'longitude':string , 'latitude':string } ,
    img:Parse.File,
    apartments:Apartment[]
  }):Promise<Building>{
    const building = new Building()
    building.name = data.name
    building.company_id = data.company_id
    building.address = data.address
    building.location = data.location
    building.img = data.img
    building.apartment = data.apartments
    return building.save()
  }
   deleteBuilding( building: Building ){
    return building.destroy()
  }

  getBuilding(buildingId: string): Promise<Building | undefined>  {
    const query = new Query(Building);
    query.equalTo('objectId', buildingId);
    return query.first();
  }
  
  updateBuilding(building: Building): Promise<Building> {
    return building.save();
  }
  
}
  