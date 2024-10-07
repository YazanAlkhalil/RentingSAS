import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Contract } from "../../models/Contract";

Parse.Cloud.afterSave(Contract, async (request) => {
    const contract = request.object;
    const sessionToken = request.user?.getSessionToken();
    if(!contract.existed()){
        const apartmentId = contract.get("apartment")?.id;
        if (apartmentId) {
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
                        contract.setACL(acl);
                        await contract.save(null, {sessionToken});
                    }
                }
            }
        }
    }
});
