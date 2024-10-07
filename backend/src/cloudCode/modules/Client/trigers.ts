import { Client } from "../../models/Client";

Parse.Cloud.afterSave(Client, async (request) => {
    const client = request.object;
    const sessionToken = request.user?.getSessionToken();
    if (!client.existed()) {
        const companyId = client.get("company")?.id;
        if (companyId) {
            const companyRole = await new Parse.Query(Parse.Role)
                .equalTo("name", `${companyId}`).first({sessionToken});
            if (companyRole) {
                const acl = new Parse.ACL();
                acl.setPublicReadAccess(false)
                acl.setPublicWriteAccess(false)
                acl.setRoleReadAccess(companyRole.getName(), true);
                acl.setRoleWriteAccess(companyRole.getName(), true);
                client.setACL(acl);
                await client.save(null, {sessionToken});
            }
        }
    }
});