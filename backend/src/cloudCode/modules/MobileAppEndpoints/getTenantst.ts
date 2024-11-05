import { Client } from "../../models/Client";
import { Company } from "../../models/Company";
import { Contract } from "../../models/Contract";

Parse.Cloud.define("getTenants", async (request) => {
const {code} = request.params;
const sessionToken = request?.user?.getSessionToken();
const clientsQuery = new Parse.Query(Client)
.equalTo("isArchived", false)

if(code){
    clientsQuery.equalTo("statusCode", code);
}

const clients = await clientsQuery.find({sessionToken});
const company = request?.user?.get("company") as Company;
await company.fetch({sessionToken});
const contracts = await new Parse.Query(Contract)
.equalTo("isArchived", false)
.include("apartment")
.containedIn("client", clients)
.find({sessionToken});

const result = clients.map((client) => {
    const contract = contracts.find((c) => c.get("client").id === client.id);
    if(contract){
        return {
            name: client.get("name"),
            status: client.get("status"),
            apartment: contract.get("apartment").get("name"),
            startDate: contract.get("startDate").toLocaleDateString(),
            endDate: contract.get("endDate").toLocaleDateString(),
            currency: company.get("currency"),
            frequency: contract.get("paymentFrequency"),
            type: contract.get("type"),
            amount: contract.get("rentAmount"),

        }
    }
    return {
        name: client.get("name"),
        status: client.get("status"),
    }
})

return result;
})