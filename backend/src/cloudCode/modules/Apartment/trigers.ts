import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";

Parse.Cloud.afterSave(Apartment, async (request) => {
    const apartment = request.object;
    const sessionToken = request.user?.getSessionToken();
    if (!apartment.existed()) {
        const buildingId = apartment.get("building")?.id;
        const building = await new Parse.Query(Building).get(buildingId,{sessionToken});

        if (building) {
            const companyId = building.get("company")?.id;
            if (companyId) {
                const companyRoleQuery = new Parse.Query(Parse.Role)
                    .equalTo("name", `${companyId}`);
                const companyRole = await companyRoleQuery.first({ sessionToken });
                if (companyRole) {
                    const acl = new Parse.ACL();
                    acl.setPublicReadAccess(false)
                    acl.setPublicWriteAccess(false)
                    acl.setRoleReadAccess(companyRole.getName(), true);
                    acl.setRoleWriteAccess(companyRole.getName(), true);
                    acl.setRoleReadAccess('admin', true);
                    acl.setRoleWriteAccess('admin', true);
                    apartment.setACL(acl);
                    await apartment.save(null, { sessionToken });
                }
            }
        }
    }
});
