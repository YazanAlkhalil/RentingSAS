import { Injectable } from "@angular/core";
import { Building } from "../../models/Building";
import { AuthService } from "../other/auth.service";
import Parse from "parse";

@Injectable({
  providedIn: "root",
})
export class BuildingService {
  constructor(private authService: AuthService) {}

  getBuildings(data: {
    pageIndex?: number;
    pageSize?: number;
    sortField?: string;
    searchValue?: string;
    withCount?: boolean;
  }): Promise<Building[]> {
    const company = this.authService.getCurrentUser()?.get("company");
    return Parse.Cloud.run("getBuildings", { data, companyId: company?.id });
  }

  async addBuilding(building: Building): Promise<Building> {
    const company = this.authService.getCurrentUser()?.get("company");
    if(building.img){
      await building.img.save();
    }
    return Parse.Cloud.run("addBuilding", { name: building.name, address: building.address, location: building.location, img: building.img, companyId: company?.id });
  }

  deleteBuilding(buildingId: string) {
    return Parse.Cloud.run("deleteBuilding", { buildingId });
  }

  async updateBuilding(building: Building): Promise<Building> {
    console.log(!building.img?._url,'s');
    if (building.img && !building.img?._url) {
      await building.img.save();
    }
    return Parse.Cloud.run("updateBuilding", {
      buildingId: building.id,
      name: building.name,
      address: building.address,
      location: building.location,
      img: building.img,
    });
  }

  // getBuilding(buildingId: string): Promise<Building | undefined> {
  //   return Parse.Cloud.run("getBuilding", { buildingId });
  // }
}
