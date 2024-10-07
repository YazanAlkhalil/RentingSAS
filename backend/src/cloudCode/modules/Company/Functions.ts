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

    console.log('==========companyObject==========');
    console.log(companyObject, 'companyObject');
    console.log('==========companyObject==========');


    if (companyObject) {
        try {
            const buildings = await new Parse.Query(Building)
                .equalTo("company", companyObject.toPointer())
                .find({ sessionToken });

            console.log('==========buildings==========');
            console.log(buildings, 'buildings');
            console.log('==========buildings==========');

            const apartments = await new Parse.Query(Apartment)
                .containedIn("building", buildings)
                .find({ sessionToken });

            console.log('==========apartments==========');
            console.log(apartments, 'apartments');
            console.log('==========apartments==========');

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
