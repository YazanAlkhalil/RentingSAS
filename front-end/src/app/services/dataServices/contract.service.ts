import { Injectable } from "@angular/core";
import { Pointer } from "parse";
import { Payment } from "../../models/Interfaces/Payment";
import { Contract } from "../../models/Contract";
import { Client } from "../../models/Interfaces/Client";
import { AuthService } from "../other/auth.service";
import { Apartment } from "../../models/Interfaces/Apartment";
import { Company } from "../../models/Company";
import { Building } from "../../models/Building";

@Injectable({
  providedIn: "root",
})
export class ContractService {
  constructor( private authService: AuthService ) {}

  addContract(contract:Contract , apartment:{apartment:Apartment , buildingId:string , buildingName:string}): Promise<Contract> {
    const company_id = new Company()
    company_id.id = this.authService.getCurrentUser()?.get('company_id')
    contract.set('company_id',company_id)
    const building_id = new Building()
    building_id.id = apartment.buildingId
    contract.set('building_id' , building_id)
    contract.apartment_id = apartment.apartment._id
    return contract.save();
  }

  deleteContract(contract:Contract){
    return contract.destroy()
  }
}
