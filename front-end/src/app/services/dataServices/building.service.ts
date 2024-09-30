import { Injectable } from '@angular/core';
import {Building} from '../../models/Building'
import { Query } from 'parse';
@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor() { }
  getBuildings(data: {
    skip: number,
    limit: number,
    sortField: string,
    searchValue: string,
    withCount: boolean
  }): Promise<{ results: Building[]; count: number } | Building[]> {
  
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
      return query.find().then((results) => {
        return query.count().then((count) => {
          return { results, count };
        });
      });
    } else {
      return query.find();
    }
  }

  async addBuilding(){
    const newBuilding = new Building()
    newBuilding.set('company_id' , 'TIqTqXgve1')
    newBuilding.set('name' , 'Yazzona')
    // newBuilding.set('location' , '150 , 270')
    newBuilding.set('img','img')
    console.log(newBuilding , 'building');
    return await newBuilding.save()
  }

   deleteBuilding( building: Building ){
    return building.destroy()
  }
}
  