import { Building } from "../../models/Building";
import { Company } from "../../models/Company";

Parse.Cloud.define("getBuildings", async (request) => {
    const { data, companyId } = request.params;
    const company = new Company()
    company.id = companyId
    const sessionToken = request.user?.getSessionToken();
    let query = new Parse.Query(Building);
    
    if (data?.searchValue) {
        const re = RegExp(
            `${data?.searchValue?.replace("+", "\\+")?.replace("-", "\\-")}`,
            "i"
        );
        const nameQuery = new Parse.Query(Building).matches("name", re);
        const addressQuery = new Parse.Query(Building).matches("address", re);
        query = Parse.Query.or(nameQuery, addressQuery);
    }

    query.equalTo("company", company);


    // Handle sorting
    if (data?.sortField) {
        if (data.sortOrder === -1) {
            query.descending(data.sortField);
        } else {
            query.ascending(data.sortField);
        }
    } else {
        query.descending("createdAt");
    }

    query.include([
        "company",
        "name",
        "address",
        "location",
        "img",
    ]); 

    if (data?.withCount) {
        query.withCount(true);
    }
    if (data?.pageIndex) {
        query.skip(data?.pageIndex);
    }
    if (data?.pageSize) {
        query.limit(data?.pageSize);
    }else{
        query.limit(10000000);
    }
    query.equalTo("isArchived", false);
    return query.find({ sessionToken });
})

Parse.Cloud.define("addBuilding", async (request) => {
    const sessionToken = request.user?.getSessionToken();
    const { name, address, location, img, companyId } = request.params;
    const company = new Company();
    company.id = companyId;
    const buildingObj = new Building();
    buildingObj.name = name;
    buildingObj.address = address;
    buildingObj.location = location;
    buildingObj.isArchived = false;
    console.log(img);
    console.log(img);
    console.log(img);
    buildingObj.img = img;
    buildingObj.company = company;
    return buildingObj.save(null, { sessionToken });
});

Parse.Cloud.define("deleteBuilding", async (request) => {
    const { buildingId } = request.params;
    const sessionToken = request.user?.getSessionToken();
    const building = new Building();
    building.id = buildingId;
    await building.fetch({ sessionToken });
    building.isArchived = true;
    return building.save(null, { sessionToken });
});

Parse.Cloud.define("getBuilding", async (request) => {
    const sessionToken = request.user?.getSessionToken();
    const { buildingId } = request.params;
    const query = new Parse.Query(Building);
    query.equalTo("objectId", buildingId);
    return query.first({ sessionToken });
});

Parse.Cloud.define("updateBuilding", async (request) => {
    const sessionToken = request.user?.getSessionToken();
    const { buildingId, name, address, location, img } = request.params;
    const building = new Building();
    building.id = buildingId;
    await building.fetch({ sessionToken });
    building.name = name;
    building.address = address;
    building.location = location;
    building.img = img;
    return building.save(null, { sessionToken });
})
