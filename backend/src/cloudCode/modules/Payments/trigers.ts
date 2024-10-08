import { Payment } from "../../models/Payment";
import { Contract } from "../../models/Contract";
import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";



Parse.Cloud.afterSave(Payment, async (request) => {
    const payment = request.object;
    const sessionToken = request.user?.getSessionToken();
    if(!payment.existed()){
        const contractId = payment.get("contract")?.id;
        if(contractId){
            const contract = await new Parse.Query(Contract).get(contractId,{sessionToken});
            if(contract){
                const apartmentId = contract.get("apartment")?.id;
                const apartment = await new Parse.Query(Apartment).get(apartmentId,{sessionToken});
                if(apartment){
                    const buildingId = apartment.get("building")?.id;
                    const building = await new Parse.Query(Building).get(buildingId,{sessionToken});
                    if(building){
                        const companyId = building.get("company")?.id;
                        const companyRoleQuery = new Parse.Query(Parse.Role)
                        .equalTo("name", `${companyId}`);
                        const companyRole = await companyRoleQuery.first({sessionToken});
                        if(companyRole){
                            const acl = new Parse.ACL();
                            acl.setPublicReadAccess(false)
                            acl.setPublicWriteAccess(false)
                            acl.setRoleReadAccess(companyRole.getName(), true);
                            acl.setRoleWriteAccess(companyRole.getName(), true);
                            acl.setRoleReadAccess('admin', true);
                            acl.setRoleWriteAccess('admin', true);
                            payment.setACL(acl);
                            await payment.save(null, {sessionToken});
                        }
                    }
                }
            }
        }
    }
});
