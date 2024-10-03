// import { Building } from "../../models/Building";
// import { Contract } from "../../models/Contract";
// import { Apartment } from "../../models/Interfaces/Apartment";
// Parse.Cloud.afterSave(Contract, async (request) => {
//   const contract = request.object;
//   const id = request.user?.id
//   const action = request.object.existed() ? 'updated' : 'created';
  
//   await generateContractReport(contract, action,id);
// });

// Parse.Cloud.afterDelete('Contract', async (request) => {
//   const contract = request.object;
//   const id = request.user?.id
//   await generateContractReport(contract, 'deleted',id);
// });

// async function generateContractReport(contract: Parse.Object, action: string, id: string | undefined) {
//   console.log(action);
//   console.log("action=====================");

//   const report = new Parse.Object('Report');
//   console.log(contract.get('building_id'));
//   console.log(contract.get('building_id'));
//   console.log(contract.get('building_id'));
//   console.log(contract.get('building_id'));
//   const buildingQuery = new Parse.Query("Building");
//   buildingQuery.equalTo('id',contract.get('building_id').id)
//   const building = await buildingQuery.first({useMasterKey:true});
//   if(building){
//     report.set('building_name', building.get('name'));
//     const apartment = building.attributes.apartment.find((apa:Apartment) => apa._id === contract.get('apartment_id'))
//     report.set('apartment_name', apartment.get('name'));
//   }
//   else{
//     console.log('building not found');
//     return 
//   }
  
//   console.log('============ report ============');
//   console.log(report);
//   console.log('============ report ============');


//   const companyQuery = new Parse.Query('Company');
//   const company = await companyQuery.get(contract.get('company_id').id);
//   report.set('company_name', company.get('name'));


//   if (id) {
//     const userQuery = new Parse.Query(Parse.User);
//     const user = await userQuery.get(id);
//     report.set('username', user.get('username'));
//   }
  
//   if (action === 'updated') {
//     console.log(`Contract ${contract.id} ${action}`);
//   } else if (action === 'deleted') {
//     console.log('deleted entered');
//     report.set('type', 'contract_deleted');
//   } else if (action === 'created') {
//     report.set('type', 'contract_created');
//   }

//   console.log(report);
//   console.log("report=====================");
//   await report.save();
// }
