import { Injectable } from "@angular/core";
import { Apartment } from "../../models/Apartment";
import { AuthService } from "../other/auth.service";
import Parse from "parse";


@Injectable({
  providedIn: "root",
})
export class ApartmentService {
  constructor( private authService:AuthService ,
   ) {}
  async getApartments(data: {
    skip?: number;
    limit?: number;
    sortField?: string;
    searchValue?: string;
    withCount?: boolean;
  }): Promise<{apartment:Apartment, EstimatedRentPrice:number}[] | any> {
    return Parse.Cloud.run("getApartments", { data, companyId: this.authService.getCurrentUser()?.get('company').id });
  }

   addApartment(apartment:Apartment){
    
    
    return Parse.Cloud.run("addApartment", { name: apartment.name, floor: apartment.floor, size: apartment.size, isFurnished: apartment.isFurnished, status: apartment.status, bedroom: apartment.bedroom, bathroom: apartment.bathroom, rentPrice: apartment.rentPrice, imgs: apartment.imgs,
      number: apartment.number,
      description: apartment.description,
      amenities: apartment.amenities,
      owner: apartment.owner,
      buildingId: apartment.building.id 
    })
  }
  deleteApartment(apartment:Apartment){
    return Parse.Cloud.run("deleteApartment", { apartmentId: apartment.id })
  }

  updateApartment(apartment:Apartment){
    return Parse.Cloud.run("updateApartment", { apartmentId: apartment.id, name: apartment.name, floor: apartment.floor, size: apartment.size, isFurnished: apartment.isFurnished, statusCode: apartment.statusCode, bedroom: apartment.bedroom, bathroom: apartment.bathroom, rentPrice: apartment.rentPrice, imgs: apartment.imgs,
      number: apartment.number,
      description: apartment.description,
      amenities: apartment.amenities,
      buildingId: apartment.building.id,
      owner: apartment.owner })
  }
}
