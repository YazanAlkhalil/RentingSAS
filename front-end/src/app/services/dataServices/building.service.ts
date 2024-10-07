import { Injectable } from "@angular/core";
import { Building } from "../../models/Building";
import {  Query } from "parse";
import { AuthService } from "../other/auth.service";
import { Company } from "../../models/Company";
@Injectable({
  providedIn: "root",
})
export class BuildingService {
  constructor(private authService: AuthService) {}
  getBuildings(data: {
    skip: number;
    limit: number;
    sortField: string;
    searchValue: string;
    withCount: boolean;
  }): Promise<Building[]> {
    const company = this.authService.getCurrentUser()?.get("company");
    let query = new Query(Building);
    query.equalTo("company", company);
    if (data.searchValue) {
      const re = RegExp(
        `${data?.searchValue?.replace("+", "\\+").replace("-", "\\-")}`,
        "i"
      );
      const descQuery = new Query(Building).matches("description", re);
      query = Query.or(descQuery);
    }
    query
      .descending(data.sortField)
      .skip(data.skip)
      .limit(data.limit)
      .descending("createdAt")
      .include([
        "company",
        "name",
        "address",
        "location",
        "img",
      ]);

    if (data.withCount) {
      query.withCount(true);
    }
    return query.find();
  }
  addBuilding(building: Building): Promise<Building> {
    building.company = this.authService.getCurrentUser()?.get("company");;
    return building.save();
  }
  deleteBuilding(building: Building) {
    return building.destroy();
  }

  getBuilding(buildingId: string): Promise<Building | undefined> {
    const query = new Query(Building);
    query.equalTo("objectId", buildingId);
    return query.first();
  }

}
