import { Building } from "../../models/Building";

Parse.Cloud.afterSave("Company", async (request) => {
  const company = request.object;
  const sessionToken = request.user?.getSessionToken();
  if (!company.existed()) {
    console.log("company is existed")
    const roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(false);
    roleACL.setPublicWriteAccess(false);
    roleACL.setRoleReadAccess('admin', true);
    roleACL.setRoleWriteAccess('admin', true);
    const companyRole = new Parse.Role(`${company.id}`, roleACL);
    roleACL.setRoleReadAccess(companyRole.getName(), true); 
    await companyRole.save(null, { sessionToken });

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleReadAccess('admin', true);
    acl.setRoleWriteAccess('admin', true);
    acl.setRoleReadAccess(companyRole.getName(), true);
    acl.setRoleWriteAccess(companyRole.getName(), true);
    company.setACL(acl);
    await company.save(null, { sessionToken});
  }
});




