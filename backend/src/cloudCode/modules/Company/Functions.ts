import {Company} from "../../models/Company"
import {Building} from "../../models/Building"

Parse.Cloud.define("deleteCompany", async (req: Parse.Cloud.FunctionRequest) => {
    const company = req.params;
  const sessionToken = req.user?.getSessionToken();
  const companyRole = await new Parse.Query(Parse.Role).equalTo("name", `${company.id}`).first({sessionToken});
  if(companyRole){
        const usersRelation = companyRole.getUsers();
        const usersQuery = usersRelation.query();
        const users = await usersQuery.find({sessionToken});
        if (users.length > 0) {
          await Parse.Object.destroyAll(users,{sessionToken});
        }
  }
  new Parse.Query(Building).equalTo("company", company).find({sessionToken})
  .then(Parse.Object.destroyAll)
  .catch(err => {
    console.log(err);
  })
  const companyQuery = new Parse.Query(Company);
  companyQuery.equalTo("objectId", company.id);
  const companyObject = await companyQuery.first({sessionToken});
  if(companyObject){
    await companyObject.destroy({sessionToken});
  }
});
