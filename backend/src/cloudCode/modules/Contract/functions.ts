import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Client } from "../../models/Client";
import { Company } from "../../models/Company";
import { Contract } from "../../models/Contract";
import { ApartmentStatusCodes, ClientTypeCodes } from "../../utils/statusCodesMaps";
import { getPaymentsForContract } from "../Payments/functions";
import { updatePaymentStatus } from "../Payments/trigers";

Parse.Cloud.define("createContract", async (request) => {
    const { startDate, endDate, rentAmount, paymentFrequency, apartmentId, clientId
        , additionalInfo, specialTerms, maintenanceTerms, type, utilitiesToPay, overDuePeriodDays
    } = request.params
    const sessionToken = request?.user?.getSessionToken()
    const contract = new Contract()
    const client = new Client()
    client.id = clientId
    await client.fetch({ sessionToken })
    const apartment = new Apartment()

    apartment.id = apartmentId
    contract.apartment = apartment
    contract.paymentFrequency = paymentFrequency

    contract.client = client
    if (client.statusCode === ClientTypeCodes.former) {
        client.status = 'Active'
        client.statusCode = ClientTypeCodes.active
        await client.save(null, { sessionToken })
    }
    contract.startDate = startDate
    contract.endDate = endDate
    contract.rentAmount = rentAmount
    contract.additionalInfo = additionalInfo
    contract.specialTerms = specialTerms
    contract.maintenanceTerms = maintenanceTerms
    contract.type = type
    contract.utilitiesToPay = utilitiesToPay
    contract.isExpired = false
    contract.isArchived = false
    contract.overDuePeriodDays = overDuePeriodDays || 14
    await contract.save(null,{sessionToken})
    await apartment.fetch({ sessionToken })
    if (apartment) {
        apartment.status = "occupied";
        apartment.statusCode = ApartmentStatusCodes.Occupied;
        await apartment.save(null, { sessionToken });
    }
    return contract
});

Parse.Cloud.define("getContract", async (request) => {
    const { apartmentId } = request.params
    const sessionToken = request?.user?.getSessionToken()
    if (!apartmentId) throw new Error("Apartment is required")
    const contractQuery = new Parse.Query(Contract);
    const apartment = new Apartment()
    apartment.id = apartmentId
    contractQuery.equalTo("apartment", apartment);
    contractQuery.equalTo("isArchived", false)
    const contract = await contractQuery.first({ sessionToken })
    if (!contract) return null
    const client = await contract?.get('client').fetch({ sessionToken })
    return { contract, client }
})


Parse.Cloud.define("getContracts", async (request) => {
    const { data, companyId } = request.params
    if (!companyId) throw new Error("Company is required")
    const sessionToken = request?.user?.getSessionToken()
    const company = new Company()
    company.id = companyId

    const buildingQuery = new Parse.Query(Building)
    buildingQuery.equalTo("company", company)

    const apartmentQuery = new Parse.Query(Apartment)
    apartmentQuery.matchesQuery("building", buildingQuery)
    
    let contractQuery = new Parse.Query(Contract)
    

    if (data?.searchValue) {
        const re = RegExp(
            `${data?.searchValue?.replace("+", "\\+")?.replace("-", "\\-")}`,
            "i"
        );
        const typeQuery = new Parse.Query(Contract).matches("type", re);
        const clientNameQuery = new Parse.Query(Contract);
        const clientQuery = new Parse.Query(Client)
        clientNameQuery.matchesQuery("client", clientQuery.matches("name", re));

        const apartmentNameQuery = new Parse.Query(Contract)
        apartmentNameQuery.matchesQuery("apartment", apartmentQuery.matches("name", re));

        
        contractQuery = Parse.Query.or(typeQuery, clientNameQuery, apartmentNameQuery);
    }

    contractQuery.matchesQuery("apartment", apartmentQuery)
    contractQuery.equalTo("isArchived", false)
     // Handle sorting
    if (data?.sortField) {
        if (data.sortOrder === -1) {
            contractQuery.descending(data.sortField);
        } else {
            contractQuery.ascending(data.sortField);
        }
    } else {
        contractQuery.descending("createdAt");
    }
    contractQuery.include(["client", "apartment"])
    
    if (data?.pageIndex !== undefined) {
        contractQuery.skip(data.pageIndex);
    }
    if (data?.pageSize) {
        contractQuery.limit(data.pageSize);
    }
    else{
        contractQuery.limit(10000000)
    }

    if (data?.withCount) {
        contractQuery.withCount();
    }

    return await contractQuery.find({ sessionToken })
})


Parse.Cloud.define("updateContract", async (request) => {
    const { startDate, endDate, rentAmount, paymentFrequency, contractId, clientId
        , additionalInfo, specialTerms, maintenanceTerms, type, utilitiesToPay, overDuePeriodDays
    } = request.params
    const sessionToken = request?.user?.getSessionToken()
    let overDueDayChanged = false
    const contract = new Contract()
    contract.id = contractId
    await contract.fetch({ sessionToken })
    contract.startDate = startDate
    contract.endDate = endDate
    contract.rentAmount = rentAmount
    contract.paymentFrequency = paymentFrequency
    contract.additionalInfo = additionalInfo
    contract.specialTerms = specialTerms
    contract.maintenanceTerms = maintenanceTerms
    contract.type = type
    if(overDuePeriodDays !== contract.get('overDuePeriodDays')) overDueDayChanged = true
    
    contract.overDuePeriodDays = overDuePeriodDays
    contract.utilitiesToPay = utilitiesToPay
    if (clientId !== contract.get('client').id) {
        const oldClient = await contract.get('client').fetch({ sessionToken })
        let newClient = new Client()
        newClient.id = clientId
        contract.client = newClient

        //update new client status
        newClient = await newClient.fetch({ sessionToken })
        newClient.status = 'Active'
        newClient.statusCode = ClientTypeCodes.active
        await newClient.save(null, { sessionToken })


        //update old client status
        console.log(oldClient.get('name'), 'old client')
        const contractQuery = new Parse.Query(Contract)
        contractQuery.equalTo("client", oldClient)
        contractQuery.equalTo("isArchived", false)
        contractQuery.notEqualTo("objectId", contract.id)
        const contracts = await contractQuery.find({ sessionToken })
        if (contracts.length === 0) {
            oldClient.status = 'Former'
            oldClient.statusCode = ClientTypeCodes.former
            await oldClient.save(null, { sessionToken })
        }
    }
    await contract.save(null, { sessionToken })
    if(overDueDayChanged){
        console.log('overDueDayChanged')
        const payments = await getPaymentsForContract(request)
        updatePaymentStatus(payments)
    }
    return contract
})


Parse.Cloud.define("deleteContract", async (request) => {
    const { id } = request.params

    const sessionToken = request?.user?.getSessionToken()
    const contract = new Contract()
    contract.id = id
    await contract.fetch({ sessionToken })
    contract.isArchived = true
    await contract.save(null, { sessionToken })
    const client = await contract.get('client').fetch({ sessionToken })
    const contractQuery = new Parse.Query(Contract)
    contractQuery.equalTo("client", client)
    contractQuery.equalTo("isArchived", false)
    const contracts = await contractQuery.find({ sessionToken })
    if (contracts.length === 0) {
        client.status = 'Former'
        client.statusCode = ClientTypeCodes.former
        await client.save(null, { sessionToken })
    }
    const apartment = await contract.get('apartment').fetch({ sessionToken })
    if (apartment) {
        apartment.status = "vacant"
        apartment.statusCode = ApartmentStatusCodes.Vacant
        await apartment.save(null, { sessionToken })
    }
    return contract
})
