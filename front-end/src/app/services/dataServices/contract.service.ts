import { Injectable } from "@angular/core";
import { Pointer } from "parse";
import { Payment } from "../../models/Payment";
import { Contract } from "../../models/Contract";
import { Client } from "../../models/Client";
import { AuthService } from "../other/auth.service";
import { Apartment } from "../../models/Apartment";
import { Company } from "../../models/Company";
import { Building } from "../../models/Building";
import Parse from "parse";

@Injectable({
  providedIn: "root",
})
export class ContractService {
  constructor( private authService: AuthService ) {}

  async addContract(contract:Contract , apartment:Apartment): Promise<Contract> {
    // contract.set('company_id',this.authService.getCurrentUser()?.get('company_id'))
    // const building_id = new Building()
    // building_id.id = apartment.get('building_id')
    // contract.set('building_id' , building_id)
    // const res = await fetch('http://localhost:1337/parse/createContract',{
    //   method:'POST',
    //   headers:{
    //     'Content-Type':'application/json',
    //   },
    //   body:JSON.stringify({
    //     contract:contract,
    //     apartment:apartment,
    //     paymentFrequency:paymentFrequency
    //   })
    // })
    // return res.json()
    console.log(contract, 'contract')
    console.log(contract.maintenanceTerms, 'maintenanceTerms')
    return Parse.Cloud.run('createContract',{
      startDate:contract.startDate,
      endDate:contract.endDate,
      rentAmount:contract.rentAmount,
      paymentFrequency:contract.paymentFrequency,
      apartmentId:apartment.id,
      clientId:contract.client.id,
      additionalInfo:contract.additionalInfo,
      specialTerms:contract.specialTerms,
      maintenanceTerms:contract.maintenanceTerms,
      type:contract.type,
      utilitiesToPay:contract.utilitiesToPay,
      overDuePeriodDays:contract.overDuePeriodDays
    })
    
  }

  deleteContract(contract:Contract){
    console.log(contract, 'contract')
    return Parse.Cloud.run('deleteContract',{
      id:contract.id
    })
  }
  getContracts(data:any){
    return Parse.Cloud.run('getContracts',{
      companyId:this.authService.getCurrentUser()?.get('company')?.id,
      data
    })
  }

  updateContract(contract: Contract, client: Client): Promise<any> {
    return Parse.Cloud.run("updateContract", { 
      startDate: contract.get('startDate'),
      endDate: contract.get('endDate'),
      rentAmount: contract.get('rentAmount'),
      paymentFrequency: contract.get('paymentFrequency'),
      contractId: contract.id,
      clientId: client.id,
      additionalInfo: contract.get('additionalInfo'),
      specialTerms: contract.get('specialTerms'),
      maintenanceTerms: contract.get('maintenanceTerms'),
      utilitiesToPay: contract.get('utilitiesToPay'),
      type: contract.get('type'),
      overDuePeriodDays: contract.get('overDuePeriodDays')
    });
  }
}
