import { Apartment } from "../../models/Apartment";
import { Expenses } from "../../models/Expenses";
import { Building } from "../../models/Building";

Parse.Cloud.afterSave(Expenses, async (request) => {
    const expenses = request.object;
    if(!expenses.existed()){
        const apartmentId = expenses.get("apartment")?.id;
        if(apartmentId){
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
                        expenses.setACL(acl);
                        await expenses.save(null, {useMasterKey: true});
                    }
                }
            }
        }
    }
});