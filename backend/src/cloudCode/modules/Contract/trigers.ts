import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Contract } from "../../models/Contract";

Parse.Cloud.afterSave(Contract, async (request) => {
    const contract = request.object;
    if(!contract.existed()){
        const apartmentId = contract.get("apartment")?.id;
        if (apartmentId) {
            const apartment = await new Parse.Query(Apartment).get(apartmentId);
            if(apartment){
                const buildingId = apartment.get("building")?.id;
                const building = await new Parse.Query(Building).get(buildingId);
                if(building){
                    const companyId = building.get("company")?.id;
                    const companyRoleQuery = new Parse.Query(Parse.Role)
                        .equalTo("name", `${companyId}`);
                    const companyRole = await companyRoleQuery.first({ useMasterKey: true });
                    if(companyRole){
                        const acl = new Parse.ACL();
                        acl.setPublicReadAccess(false)
                        acl.setPublicWriteAccess(false)
                        acl.setRoleReadAccess(companyRole.id, true);
                        acl.setRoleWriteAccess(companyRole.id, true);
                        contract.setACL(acl);
                        await contract.save(null, { useMasterKey: true });
                    }
                }
            }
        }
    }
});
