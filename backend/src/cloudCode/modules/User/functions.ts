import { Company } from "../../models/Company";

Parse.Cloud.define("getUsers", async (request) => {
    const { companyId } = request.params;
    const sessionToken = request.user?.getSessionToken();
    const query = new Parse.Query(Parse.User);
    const company = new Company()
    company.id = companyId
    query.equalTo('company', company);

    return await query.find({sessionToken})
});
