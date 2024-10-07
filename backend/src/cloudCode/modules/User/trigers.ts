// Function to set restrictive ACL on user creation
Parse.Cloud.beforeSave(Parse.User, (request) => {
  const user = request.object;
  if (!user.existed()) {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setRoleWriteAccess("admin", true);
    user.setACL(acl);
  }
});


Parse.Cloud.afterSave(Parse.User, async (request) => {
  const sessionToken = request.user?.getSessionToken();
  const user = request.object;
  if(!user.existed()){
    const companyId = user.get("company")?.id;
    if (companyId) {
      const companyRoleQuery = new Parse.Query(Parse.Role)
      .equalTo("name", `${companyId}`)
      const companyRole = await companyRoleQuery.first({sessionToken});
  
      if (companyRole) {
          console.log('========================================================')
          companyRole.getUsers().add(user);
          await companyRole.save(null, {sessionToken});
          const acl = new Parse.ACL();
          acl.setRoleReadAccess('admin', true);
          acl.setRoleWriteAccess('admin', true);
          acl.setRoleReadAccess(companyRole.id, true);
          acl.setRoleWriteAccess(companyRole.id, true);
          user.setACL(acl);
          await user.save(null, {sessionToken});
      }    
    }
  }
});
