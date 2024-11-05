import { Apartment } from "../../models/Apartment";
import { Contract } from "../../models/Contract";
import { Company } from "../../models/Company";

const apartmentsFunction = async (request: Parse.Cloud.FunctionRequest) => {
    const sessionToken = request?.user?.getSessionToken();
    const code = request?.params?.code;
    const company = request?.user?.get("company") as Company;

    await company.fetch({sessionToken});
    
    const apartmentsQuery = new Parse.Query(Apartment)

    .include('building')
    .equalTo("isArchived", false)
    if(code){
        apartmentsQuery.equalTo("statusCode", code);
    }
    const apartments = await apartmentsQuery.find({sessionToken});
    const contracts = await new Parse.Query(Contract)
    .include("client")
    .equalTo("isArchived", false)
    .containedIn("apartment", apartments)
    .find({sessionToken});


    const apartmentWithContracts = apartments.map((apartment) => {
        const contract : Contract | undefined = contracts.find((c) => c.get("apartment").id === apartment.id);
        const result = {
            name: apartment.get("name"),
            address: apartment.get("building").get("address"),
            owner: apartment.get("owner"),
            type: apartment.get("type"),
            isFurnished: apartment.get("isFurnished"),
            bedrooms: apartment.get("bedroom"),
            bathrooms: apartment.get("bathroom"),
            squareFeet: apartment.get("size"),
            status: apartment.get("status"),
            frequency: apartment.get("frequency"),
            rent: apartment.get("rentPrice"),
            paymentType: apartment.get("paymentType"),
            currency: company.get("currency"),
            startDate: apartment.get("lastOccupiedDate"),
            endDate: "",
            tenant: "",
        }
        if(contract){
            result.startDate = contract.get("startDate");
            result.endDate = contract.get("endDate");
            result.frequency = contract.get("paymentFrequency");
            result.rent = contract.get("rentAmount");
            result.paymentType = contract.get("type");
            result.tenant = contract.get("client").get("name");
        }
        return result;
    })
    return {apartments: apartmentWithContracts};
}








Parse.Cloud.define("apartments", apartmentsFunction);
