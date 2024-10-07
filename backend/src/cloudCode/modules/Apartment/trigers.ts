import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";

Parse.Cloud.afterSave(Apartment, async (request) => {
    const apartment = request.object;
    if (!apartment.existed()) {
        const buildingId = apartment.get("building")?.id;
        const building = await new Parse.Query(Building).get(buildingId);
        if (building) {
            const companyId = building.get("company")?.id;
            if (companyId) {
                const companyRoleQuery = new Parse.Query(Parse.Role)
                    .equalTo("name", `${companyId}`);
                const companyRole = await companyRoleQuery.first({ useMasterKey: true });
                if (companyRole) {
                    const acl = new Parse.ACL();
                    acl.setPublicReadAccess(false)
                    acl.setPublicWriteAccess(false)
                    acl.setRoleReadAccess(companyRole.id, true);
                    acl.setRoleWriteAccess(companyRole.id, true);
                    apartment.setACL(acl);
                    await apartment.save(null, { useMasterKey: true });
                }
            }
        }
    }
});
