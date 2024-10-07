import { Client } from "../../models/Client";

Parse.Cloud.afterSave(Client, async (request) => {
    const client = request.object;
    if (!client.existed()) {
        const companyId = client.get("company")?.id;
        if (companyId) {
            const companyRole = await new Parse.Query(Parse.Role)
                .equalTo("name", `${companyId}`).first({ useMasterKey: true });
            if (companyRole) {
                const acl = new Parse.ACL();
                acl.setPublicReadAccess(false)
                acl.setPublicWriteAccess(false)
                acl.setRoleReadAccess(companyRole.id, true);
                acl.setRoleWriteAccess(companyRole.id, true);
                client.setACL(acl);
                await client.save(null, { useMasterKey: true });
            }
        }
    }
});