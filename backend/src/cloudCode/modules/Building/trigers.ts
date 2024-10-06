import { Building } from "../../models/Building";

Parse.Cloud.afterSave(Building, async (request) => {
    const building = request.object;
    if (!building.existed()) {
        const companyId = building.get("company")?.id;
        if (companyId) {
            const companyRoleQuery = new Parse.Query(Parse.Role)
                .equalTo("name", `${companyId}`)
            const companyRole = await companyRoleQuery.first({ useMasterKey: true });

            if (companyRole) {
                const acl = new Parse.ACL();
                acl.setPublicReadAccess(false)
                acl.setPublicWriteAccess(false)
                acl.setRoleReadAccess(companyRole.id, true);
                acl.setRoleWriteAccess(companyRole.id, true);
                building.setACL(acl);
                await building.save(null, { useMasterKey: true });
            }
        }
    }
});