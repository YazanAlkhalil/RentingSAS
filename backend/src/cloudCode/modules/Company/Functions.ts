import {Company} from "../../models/Company"
import {Building} from "../../models/Building"
import {User} from "../../models/_User"
import {Report} from "../../models/Report"
import {Contract} from "../../models/Contract"
import { Apartment } from "../../models/Apartment"


Parse.Cloud.define("deleteCompany", async (req: Parse.Cloud.FunctionRequest) => {
    const { id } = req.params;
    console.log(id)
    console.log(req.user)
    const company = await new Parse.Query(Company).get(id);

    // Delete related buildings and their contracts
    const buildingQuery = new Parse.Query(Building);
    buildingQuery.equalTo('company', company);
    const buildings = await buildingQuery.find({useMasterKey: true});
    const apartmentQuery = new Parse.Query(Apartment)
    apartmentQuery.containedIn('building' , buildings)
    const apartments = await apartmentQuery.find({useMasterKey:true})
    
    const contractQuery = new Parse.Query(Contract);
    contractQuery.containedIn('apartment', apartments);
    const contracts = await contractQuery.find();
    Parse.Object.destroyAll(apartments , {useMasterKey:true})
    Parse.Object.destroyAll(contracts,{useMasterKey:true});
    Parse.Object.destroyAll(buildings,{useMasterKey:true});
    
    // Delete related users 
    const userQuery = new Parse.Query(User);
    userQuery.equalTo('company', company);
    const users = await userQuery.find({useMasterKey: true});
    console.log(users)
    Parse.Object.destroyAll(users,{useMasterKey:true});

    // Delete related reports
    const reportQuery = new Parse.Query(Report);
    reportQuery.equalTo('company', company);
    const reports = await reportQuery.find({useMasterKey: true});
    Parse.Object.destroyAll(reports,{useMasterKey:true});

    // Finally delete the company
    await company.destroy({useMasterKey: true});
    return company;
});
