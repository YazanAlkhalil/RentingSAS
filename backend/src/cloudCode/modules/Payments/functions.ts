import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Company } from "../../models/Company";
import { Contract } from "../../models/Contract";
import { Payment } from "../../models/Payment";
import { PaymentStatusCodes } from "../../utils/statusCodesMaps";

Parse.Cloud.define("getPaymentsForContract", async (request)=> getPaymentsForContract(request))

export async function getPaymentsForContract(request:any){
    const {contractId} = request.params;
    const sessionToken = request.user?.getSessionToken();
    if(!contractId) throw new Error("contractId is required");
    const contract = await new Parse.Query(Contract).get(contractId,{sessionToken});
    const payments = await new Parse.Query(Payment)
    .ascending("dueDate")
    .notEqualTo("isArchived",true)
    .equalTo("contract",contract)
    .include("contract")
    .find({sessionToken});
    return payments;
}

Parse.Cloud.define("updatePayment",async (request)=>{
    const {paymentId,amount,status,dueDate,paidAmount,paidDate,description,paymentMethod,transactionId,isPartiallyPaid} = request.params;
    const sessionToken = request.user?.getSessionToken();
    const payment = await new Parse.Query(Payment).get(paymentId,{sessionToken});
    payment.amount = amount;
    if(Object.keys(PaymentStatusCodes).includes(status)){
        payment.status = status;
        payment.statusCode = PaymentStatusCodes[status as keyof typeof PaymentStatusCodes];
    }
    payment.dueDate = dueDate;
    payment.paidAmount = paidAmount;
    payment.paidDate = paidDate;
    payment.description = description;
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;
    payment.isPartiallyPaid = isPartiallyPaid;
    await payment.save(null,{sessionToken});
    return payment;
})


Parse.Cloud.define("deletePayment",async (request)=>{
    const {paymentId} = request.params;
    const sessionToken = request.user?.getSessionToken();
    const payment = await new Parse.Query(Payment).get(paymentId,{sessionToken});
    payment.isArchived = true;
    await payment.save(null,{sessionToken});
    return payment;
})

Parse.Cloud.define("createPayment",async (request)=>{
    const {contractId,amount,status,dueDate,paidAmount,paidDate,description,paymentMethod,transactionId,isPartiallyPaid} = request.params;
    const sessionToken = request.user?.getSessionToken();
    const contract = await new Parse.Query(Contract).get(contractId,{sessionToken});
    if(!contract) throw new Error("Contract not found");
    const payment = new Payment();
    payment.contract = contract;
    payment.amount = amount;
    if(Object.keys(PaymentStatusCodes).includes(status)){
        payment.status = status;
        payment.statusCode = PaymentStatusCodes[status as keyof typeof PaymentStatusCodes];
    }
    payment.dueDate = dueDate;
    payment.paidAmount = paidAmount;
    payment.paidDate = paidDate;
    payment.description = description;
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;
    payment.isPartiallyPaid = isPartiallyPaid;
    payment.isArchived = false;
    await payment.save(null,{sessionToken,silent:true});
    return payment;
})


Parse.Cloud.define("getPaymentsForCompany", async (request) => {
    const sessionToken = request.user?.getSessionToken();
    const company = request.user?.get("company") as Company;
    const { data } = request.params;

    const buildingsQuery = new Parse.Query(Building)
        .equalTo("company", company)
        .equalTo("isArchived", false);

    const apartmentsQuery = new Parse.Query(Apartment)
        .matchesQuery("building", buildingsQuery)
        .equalTo("isArchived", false);

    const contractsQuery = new Parse.Query(Contract)
        .matchesQuery("apartment", apartmentsQuery)
        .equalTo("isArchived", false);

    let paymentsQuery = new Parse.Query(Payment)
        

    if (data?.searchValue) {
        const re = RegExp(
            `${data?.searchValue?.replace("+", "\\+")?.replace("-", "\\-")}`,
            "i"
        );
        const statusQuery = new Parse.Query(Payment).matches('status', re);
        
        apartmentsQuery.matches('name', re);
        const contractsWithNameQuery = new Parse.Query(Contract)
            .matchesQuery('apartment', apartmentsQuery);
        const apartmentNameQuery = new Parse.Query(Payment)
            .matchesQuery("contract", contractsWithNameQuery);
        
        paymentsQuery = Parse.Query.or(statusQuery, apartmentNameQuery);
    }
    paymentsQuery.matchesQuery("contract", contractsQuery)
    paymentsQuery.include('contract.apartment');
    paymentsQuery.equalTo("isArchived", false);
    if (data?.sortField) {
        if (data.sortOrder === -1) {
            paymentsQuery.descending(data.sortField);
        } else {
            paymentsQuery.ascending(data.sortField);
        }
    } else {
        paymentsQuery.descending("dueDate");
    }

    if (data?.pageIndex !== undefined) {
        paymentsQuery.skip(data.pageIndex);
    }
    if (data?.pageSize) {
        paymentsQuery.limit(data.pageSize);
    }
    else{
        paymentsQuery.limit(1000000000);
    }

    if (data?.withCount) {
        paymentsQuery.withCount()
    }

    const payments = await paymentsQuery.find({ sessionToken });
    return payments;
});
