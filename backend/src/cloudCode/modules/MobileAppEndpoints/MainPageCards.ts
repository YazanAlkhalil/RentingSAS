import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Contract } from "../../models/Contract";
import { Payment } from "../../models/Payment";

const mainPageCards = async (request: Parse.Cloud.FunctionRequest) => {
    const sessionToken = request.user?.getSessionToken();
    const user = await request.user?.fetch({sessionToken});
    const company=user?.get("company");
    // const upcomingRenewals
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    const buildingQuery = new Parse.Query(Building)
        .equalTo("company", company)
        .equalTo("isArchived", false)
        .limit(100000000000)

    const apartmentsQuery = new Parse.Query(Apartment)
        .matchesQuery("building", buildingQuery)
        .equalTo("isArchived", false)
        .limit(100000000000)


    const filteredContractQuery = new Parse.Query(Contract)
        .equalTo("isArchived", false)
        .matchesQuery("apartment", apartmentsQuery)
        .lessThanOrEqualTo("endDate", oneMonthFromNow)
        .greaterThanOrEqualTo("endDate", today)
        .limit(100000000000)

    const contracts = await filteredContractQuery.count({sessionToken});
    
    const contractQuery = new Parse.Query(Contract)
    .equalTo("isArchived", false)
    .matchesQuery("apartment", apartmentsQuery)
    .limit(100000000000)
    
    apartmentsQuery.equalTo("status", "vacant")
    const vacantApartments = await apartmentsQuery.count({sessionToken});


    
    console.log(await apartmentsQuery.find({sessionToken}),'apartments')
    console.log(await contractQuery.find({sessionToken}),'contracts')
    const overDuePaymentsQuery = new Parse.Query(Payment)
    .matchesQuery("contract", contractQuery)
    .equalTo("status", "Overdue")
    .limit(100000000000)

    const upcomingPaymentsQuery1 = new Parse.Query(Payment)
    .matchesQuery("contract", contractQuery)
    .equalTo("status","Due")
    .limit(100000000000)

    const upcomingPaymentsQuery2 = new Parse.Query(Payment)
    .matchesQuery("contract", contractQuery)
    .equalTo("status","Pending")
    .greaterThanOrEqualTo("dueDate", today)
    .lessThanOrEqualTo("dueDate", oneMonthFromNow)
    .limit(100000000000)

    const upcomingPayments = await Parse.Query.or(upcomingPaymentsQuery1, upcomingPaymentsQuery2).count({sessionToken});

    const overDuePayments = await overDuePaymentsQuery.count({sessionToken});
    return {upComingRenewals:contracts, vacantApartments, overDuePayments, upcomingPayments}



}
Parse.Cloud.define("mainPageCards", mainPageCards);


