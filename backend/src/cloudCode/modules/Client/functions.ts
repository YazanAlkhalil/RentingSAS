import { Client } from "../../models/Client";
import { Company } from "../../models/Company";
import { ClientTypeCodes } from "../../utils/statusCodesMaps";
Parse.Cloud.define("createClient", async (request) => {
    const { name, phone, img, company } = request.params;
    const sessionToken = request?.user?.getSessionToken();
    const companyObj = new Company()
    companyObj.id = company;
    const client = new Client();
    client.name = name;
    client.phone = phone;
    client.company = companyObj;
    client.img = img;
    client.isArchived = false;
    client.status = "Former";
    client.statusCode = ClientTypeCodes.former;
    console.log(client, 'client')
    console.log(client.statusCode, 'client')
    console.log(ClientTypeCodes.former, 'client')
    return await client.save(null, {sessionToken});
});

Parse.Cloud.define("getClients", async (request) => {
    const {companyId,data} = request.params
    const sessionToken = request?.user?.getSessionToken();
    const company = new Company()
    company.id = companyId
    
    const clientsQuery = new Parse.Query(Client)

    if(data?.searchValue) clientsQuery.matches('name', data.searchValue)
    if(data?.pageIndex) clientsQuery.skip(data.pageIndex)
    if(data?.pageSize) clientsQuery.limit(data.pageSize)
    else clientsQuery.limit(10000000)
    if (data?.sortField) {
        if (data.sortOrder === -1) {
            clientsQuery.descending(data.sortField);
        } else {
            clientsQuery.ascending(data.sortField);
        }
    } else {
        clientsQuery.descending("createdAt");
    }
    if(data?.withCount) clientsQuery.withCount()


    clientsQuery.notEqualTo("isArchived", true)
    clientsQuery.equalTo("company", company)
    return await clientsQuery.find({sessionToken})
});

Parse.Cloud.define("updateClient", async (request) => {
    const { id, name, phone, img } = request.params;
    const sessionToken = request?.user?.getSessionToken();
    const client = new Client();
    if(!id) throw new Error("Id is required");
    client.name = name;
    client.phone = phone;
    client.img = img;
    client.id = id;
    return await client.save(null, {sessionToken});
});

Parse.Cloud.define("deleteClient", async (request) => {
    const { id } = request.params;
    const sessionToken = request?.user?.getSessionToken();
    if(!id) throw new Error("Id is required");
    let client = new Client();
    client.id = id;
    client = await client.fetch({sessionToken});
    client.isArchived = true;
    return await client.save(null, {sessionToken});
});
