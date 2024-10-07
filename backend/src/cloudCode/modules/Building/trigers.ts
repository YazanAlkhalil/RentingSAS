import { Building } from "../../models/Building";

Parse.Cloud.afterSave(Building, async (request) => {
    const building = request.object;
    const sessionToken = request.user?.getSessionToken();
    if (!building.existed()) {
        const companyId = building.get("company")?.id;
        if (companyId) {
            const companyRoleQuery = new Parse.Query(Parse.Role)
                .equalTo("name", `${companyId}`)
            const companyRole = await companyRoleQuery.first({sessionToken});

            if (companyRole) {
                const acl = new Parse.ACL();
                acl.setPublicReadAccess(false)
                acl.setPublicWriteAccess(false)
                acl.setRoleReadAccess(companyRole.getName(), true);
                acl.setRoleWriteAccess(companyRole.getName(), true);
                building.setACL(acl);
                await building.save(null, {sessionToken});
            }
        }
    }
});