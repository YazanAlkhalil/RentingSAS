import { Payment } from "../../models/Payment";
import { Contract } from "../../models/Contract";
import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";



Parse.Cloud.afterSave(Payment, async (request) => {
    const payment = request.object;
    if(!payment.existed()){
        const contractId = payment.get("contract")?.id;
        if(contractId){
            const contract = await new Parse.Query(Contract).get(contractId);
            if(contract){
                const apartmentId = contract.get("apartment")?.id;
                const apartment = await new Parse.Query(Apartment).get(apartmentId);
                if(apartment){
                    const buildingId = apartment.get("building")?.id;
                    const building = await new Parse.Query(Building).get(buildingId);
                    if(building){
                        const companyId = building.get("company")?.id;
                        const companyRoleQuery = new Parse.Query(Parse.Role)
                        .equalTo("name", `${companyId}`);
                        const companyRole = await companyRoleQuery.first({useMasterKey: true});
                        if(companyRole){
                            const acl = new Parse.ACL();
                            acl.setPublicReadAccess(false)
                            acl.setPublicWriteAccess(false)
                            acl.setRoleReadAccess(companyRole.id, true);
                            acl.setRoleWriteAccess(companyRole.id, true);
                            payment.setACL(acl);
                            await payment.save(null, {useMasterKey: true});
                        }
                    }
                }
            }
        }
    }
});
