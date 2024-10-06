import { Injectable } from "@angular/core";
import { Apartment } from "../../models/Apartment";
import { Query } from "parse";
import { Company } from "../../models/Company";
import { Building } from "../../models/Building";
import { AuthService } from "../other/auth.service";
import { BuildingService } from "./building.service";

@Injectable({
  providedIn: "root",
})
export class ApartmentService {
  constructor( private authService:AuthService ,
    private buildingService:BuildingService
   ) {}
  async getApartments(data: {
    skip: number;
    limit: number;
    sortField: string;
    searchValue: string;
    withCount: boolean;
  }): Promise<Apartment[]> {
    let query = new Query(Apartment);
    if (data.searchValue) {
      const re = RegExp(
        `${data?.searchValue?.replace("+", "\\+").replace("-", "\\-")}`,
        "i"
      );
      const descQuery = new Query(Apartment).matches("description", re);
      query = Query.or(descQuery);
    }

    const company = this.authService.getCurrentUser()?.get('company_id')
    console.log(company,'company');
    const buildings = await this.buildingService.getBuildings(data)
    console.log(buildings,'buildings');    
    query
      .containedIn("building", buildings)
      .descending(data.sortField)
      .skip(data.skip)
      .limit(data.limit)
      .include([
        "building",
        "number",
        "name",
        "floor",
        "size",
        "bedroom",
        "bathroom",
        "rentPrice",
        "amenities",
        "isFurnished",
        "status",
        "description",
        "imgs",
      ]);
    if (data.withCount) {
      query.withCount(true);
    }
    return query.find();
  }

  addApartment(apartment:Apartment){
    return apartment.save()
  }
  deleteApartment(apartment:Apartment){
    return apartment.destroy()
  }
}
