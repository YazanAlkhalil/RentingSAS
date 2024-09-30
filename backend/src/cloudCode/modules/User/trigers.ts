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