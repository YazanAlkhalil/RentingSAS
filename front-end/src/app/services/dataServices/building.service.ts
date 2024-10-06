import { Injectable } from "@angular/core";
import { Building } from "../../models/Building";
import { Pointer, Query } from "parse";
import { Apartment } from "../../models/Interfaces/Apartment";
import { AuthService } from "../other/auth.service";
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
    company_id: Pointer;
  }): Promise<Building[]> {
    let query = new Query(Building);

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
        "company_id",
        "name",
        "address",
        "location",
        "img",
        "apartment",
      ]);

    if (data.withCount) {
      query.withCount(true);
    }
    return query.find();
  }
  addBuilding(building: Building): Promise<Building> {
    building.company_id = this.authService.getCurrentUser()?.get("company_id");
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

  updateBuilding(building: Building): Promise<Building> {
    return building.save();
  }
}
