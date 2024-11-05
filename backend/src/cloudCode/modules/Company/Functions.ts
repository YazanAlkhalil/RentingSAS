import { Company } from "../../models/Company"
import { Building } from "../../models/Building"
import { Apartment } from "../../models/Apartment";

Parse.Cloud.define("deleteCompany", async (req: Parse.Cloud.FunctionRequest) => {
    const company = req.params;
    const sessionToken = req.user?.getSessionToken();
    const companyRole = await new Parse.Query(Parse.Role).equalTo("name", `${company.id}`).first({ sessionToken });
    if (companyRole) {
        const usersRelation = companyRole.getUsers();
        const usersQuery = usersRelation.query();
        const users = await usersQuery.find({ sessionToken });
        if (users.length > 0) {
            await Parse.Object.destroyAll(users, { sessionToken });
        }
        companyRole.destroy({ sessionToken });
    }
    const companyQuery = new Parse.Query(Company);
    companyQuery.equalTo("objectId", company.id);
    const companyObject = await companyQuery.first({ sessionToken });



    if (companyObject) {
        try {
            const buildings = await new Parse.Query(Building)
                .equalTo("company", companyObject.toPointer())
                .find({ sessionToken });

            

            const apartments = await new Parse.Query(Apartment)
                .containedIn("building", buildings)
                .find({ sessionToken });

            ;

            await Promise.all([
                Parse.Object.destroyAll(apartments,{sessionToken}),
                Parse.Object.destroyAll(buildings,{sessionToken})
            ]);
        } catch (err) {
            console.log(err);
        }

        await companyObject.destroy({ sessionToken });
    }
});


Parse.Cloud.define("getCompanies", async (req: Parse.Cloud.FunctionRequest) => {
    const sessionToken = req.user?.getSessionToken();
    const data = req.params;
    let query = new Parse.Query(Company);
    if(data.searchValue){
      const re = RegExp(`${data?.searchValue?.replace(/[+-.]/g, "\\$&")}`, "i");
      const nameQuery = new Parse.Query(Company).matches('name', re);
      const addressQuery = new Parse.Query(Company).matches('address', re);
      const emailQuery = new Parse.Query(Company).matches('contactInfo.email', re);
      const phoneQuery = new Parse.Query(Company).matches('contactInfo.phone', re);
      query = Parse.Query.or(nameQuery, addressQuery, emailQuery, phoneQuery);
    }
    if (data.sortField) {
      if (data.sortOrder === 'asc') {
        query.ascending(data.sortField);
      } else {
        query.descending(data.sortField);
      }
    } else {
      query.descending('createdAt');
    }
    query
    .skip(data.skip)
    .limit(data.limit)
    .include([
      'name',
      'address',
      'contactInfo',
      'img'
    ])
    if(data.withCount){
      query.withCount(true)
    }
    return await query.find({sessionToken})
});


Parse.Cloud.define("updateCompany",async (request)=>{
  const {companyId, name, address, contactInfo, img, overDueDays,currency} = request.params;
  const sessionToken = request.user?.getSessionToken();
  let overDueDayChanged = false
  const companyQuery = new Parse.Query(Company);
  companyQuery.equalTo("objectId", companyId);
  const company = await companyQuery.first({sessionToken});
  if(company){
    company.name = name;
    company.address = address;
    company.contactInfo = contactInfo;
    company.img = img;
    company.currency = currency;
    await company.save(null, {sessionToken});
    return company;
  }
  throw new Error("Company not found");
})