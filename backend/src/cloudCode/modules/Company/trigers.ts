Parse.Cloud.afterSave("Company", async (request) => {
  const company = request.object;
  
  if (!company.existed()) {
    console.log("company is existed")
    // Create a new role for the company
    const companyRole = new Parse.Role(`${company.id}`, new Parse.ACL());
    await companyRole.save(null, { useMasterKey: true });
  }
});

