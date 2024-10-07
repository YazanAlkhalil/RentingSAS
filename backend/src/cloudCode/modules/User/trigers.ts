// Function to set restrictive ACL on user creation
Parse.Cloud.beforeSave(Parse.User, (request) => {
  const user = request.object;
  if (user.isNew()) {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setRoleWriteAccess("admin", true);
    user.setACL(acl);
  }
});


Parse.Cloud.afterSave(Parse.User, async (request) => {
  const user = request.object;
  if(!user.existed()){
    const companyId = user.get("company")?.id;
    if (companyId) {
      const companyRoleQuery = new Parse.Query(Parse.Role)
      .equalTo("name", `${companyId}`)
      const companyRole = await companyRoleQuery.first({ useMasterKey: true });
  
      if (companyRole) {
          companyRole.getUsers().add(user);
          await companyRole.save(null, { useMasterKey: true });
          const acl = new Parse.ACL();
          acl.setRoleReadAccess('admin', true);
          acl.setRoleWriteAccess('admin', true);
          acl.setRoleReadAccess(companyRole.id, true);
          acl.setRoleWriteAccess(companyRole.id, true);
          user.setACL(acl);
          await user.save(null, { useMasterKey: true });
      }    
    }
  }
});
