import { Contract } from "../../models/Contract";
Parse.Cloud.afterSave(Contract, async (request) => {
  const contract = request.object;
  const id = request.user?.id
  const action = request.object.isNew() ? 'created' : 'updated';
  
  await generateContractReport(contract, action,id);
});

Parse.Cloud.afterDelete('Contract', async (request) => {
  const contract = request.object;
  const id = request.user?.id
  await generateContractReport(contract, 'deleted',id);
});

async function generateContractReport(contract: Parse.Object, action: string,id:string | undefined) {
  if(action === 'updated'){
    console.log(`Contract ${contract.id} ${action}`);
  }
  else if( action === 'deleted'){
    const report = new Parse.Object('Report')
    if(id){
      report.set('user_id',id)
    }
    report.set('apartment_id',contract.get('apartment_id'))
    report.set('company_id',contract.get('company_id'))
    report.set('building_id',contract.get('building_id'))
    report.set('action','contract_deleted')
    report.set('date',new Date())
    await report.save()
  }
  else{
    const report = new Parse.Object('Report')
    report.set('apartment_id',contract.get('apartment_id'))
    report.set('company_id',contract.get('company_id'))
    report.set('building_id',contract.get('building_id'))
    if(id){
        report.set('user_id',id)
    }
    report.set('action','contract_created')
    report.set('date',new Date())
    await report.save()
  }
}
