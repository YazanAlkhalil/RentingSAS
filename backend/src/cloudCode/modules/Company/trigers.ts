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
    await companyRole.save(null, { sessionToken });

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleReadAccess('admin', true);
    acl.setRoleWriteAccess('admin', true);
    acl.setRoleReadAccess(companyRole.id, true);
    acl.setRoleWriteAccess(companyRole.id, true);
    company.setACL(acl);
    await company.save(null, { sessionToken});
  }
});


Parse.Cloud.afterDelete("Company", async (request) => {
  const company = request.object;
  const sessionToken = request.user?.getSessionToken();
  const companyRole = await new Parse.Query(Parse.Role).equalTo("name", `${company.id}`).first({sessionToken});
  if(companyRole){
        const usersRelation = companyRole.getUsers();
        const usersQuery = usersRelation.query();
        console.log('==========usersQuery==========');
        const users = await usersQuery.find();
        console.log('==========usersQuery==========');

        if (users.length > 0) {
          await Parse.Object.destroyAll(users);
        }

        // Delete all users in one batch operation


  }
  new Parse.Query(Building).equalTo("company", company).find({sessionToken})
  .then(Parse.Object.destroyAll)
  .catch(err => {
    console.log(err);
  })
});


