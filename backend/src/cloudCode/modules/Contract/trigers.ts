import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Contract } from "../../models/Contract";
import { Payment } from "../../models/Payment";
import { PaymentStatusCodes } from "../../utils/statusCodesMaps";
import { updatePaymentStatus } from "../Payments/trigers";


Parse.Cloud.afterSave(Contract, async (request) => {
    const contract = request.object;
    const sessionToken = request.user?.getSessionToken();


    // create payments
    if(!contract.existed()){
        createPayments(contract)
    }


    
    // create acl for contract
    if(!contract.existed()){
        const apartmentId = contract.get("apartment")?.id;
        if (apartmentId) {
            const apartment = await new Parse.Query(Apartment).get(apartmentId,{sessionToken});
            if(apartment){
                const buildingId = apartment.get("building")?.id;
                const building = await new Parse.Query(Building).get(buildingId,{sessionToken});
                if(building){
                    const companyId = building.get("company")?.id;
                    const companyRoleQuery = new Parse.Query(Parse.Role)
                        .equalTo("name", `${companyId}`);
                    const companyRole = await companyRoleQuery.first({sessionToken});
                    if(companyRole){
                        const acl = new Parse.ACL();
                        acl.setPublicReadAccess(false)
                        acl.setPublicWriteAccess(false)
                        acl.setRoleReadAccess(companyRole.getName(), true);
                        acl.setRoleWriteAccess(companyRole.getName(), true);
                        acl.setRoleReadAccess('admin', true);
                acl.setRoleWriteAccess('admin', true);
                        contract.setACL(acl);
                        await contract.save(null, {sessionToken});
                    }
                }
            }
        }
    }



   
});


Parse.Cloud.afterDelete(Contract, async (request) => {
    const contract = request.object;
    const sessionToken = request.user?.getSessionToken();

    //update apartment status
    const apartmentId = contract.get("apartment")?.id;
    if (apartmentId) {
        
        const apartment = await new Parse.Query(Apartment).get(apartmentId,{sessionToken});
        if(apartment){
            apartment.status = "vacant";
            apartment.statusCode = "2";
            await apartment.save(null, {sessionToken});
        }
    }

    //delete payments
    const payments = await new Parse.Query(Payment).equalTo("contract", contract).find({sessionToken});
    if(payments.length > 0){
        for (const payment of payments) {
            payment.isArchived = true;
            await payment.save(null, {sessionToken});
        }
    }
});

async function createPayments(contract: Contract): Promise<Payment[]> {
    const payments: Payment[] = [];
    const startDate = contract.get("startDate");
    const endDate = contract.get("endDate");
    const paymentFrequency = contract.get("paymentFrequency");
    const rentAmount = contract.get("rentAmount");
    const contractType = contract.get("type"); 

    let currentDate = startDate;

    switch (paymentFrequency) {
        case "Monthly":
            while (currentDate < endDate) {
                const payment = new Payment();
                payment.contract = contract;
                payment.amount = rentAmount;
                payment.status = "Pending";
                payment.statusCode = PaymentStatusCodes.Pending;
                payment.paidAmount = 0;
                if (contractType === "Advance") {
                    payment.dueDate = currentDate;
                } else if (contractType === "Postpaid") {
                    payment.dueDate = addMonths(currentDate, 1);
                }
                
                payments.push(payment);
                currentDate = addMonths(currentDate, 1);
            }
            break;
        case "Trimonthly":
            while (currentDate < endDate) {
                const payment = new Payment();
                payment.contract = contract;
                payment.amount = rentAmount;
                payment.paidAmount = 0;
                payment.status = "Pending";
                payment.statusCode = PaymentStatusCodes.Pending;
                if (contractType === "Advance") {
                    payment.dueDate = currentDate;
                } else if (contractType === "Postpaid") {
                    payment.dueDate = addMonths(currentDate, 3);
                }
                
                payments.push(payment);
                currentDate = addMonths(currentDate, 3);
            }
            break;
        case "SemiAnnually":
            while (currentDate < endDate) {
                const payment = new Payment();
                payment.contract = contract;
                payment.amount = rentAmount;
                payment.status = "Pending";
                payment.paidAmount = 0;
                payment.statusCode = PaymentStatusCodes.Pending;
                if (contractType === "Advance") {
                    payment.dueDate = currentDate;
                } else if (contractType === "Postpaid") {
                    payment.dueDate = addMonths(currentDate, 6);
                }
                
                payments.push(payment);
                currentDate = addMonths(currentDate, 6);
            }
            break;
        case "Annually":
            while (currentDate < endDate) {
                const payment = new Payment();
                payment.contract = contract;
                payment.amount = rentAmount;
                payment.status = "Pending";
                payment.paidAmount = 0;
                payment.statusCode = PaymentStatusCodes.Pending;
                if (contractType === "Advance") {
                    payment.dueDate = currentDate;
                } else if (contractType === "Postpaid") {
                    payment.dueDate = addMonths(currentDate, 12);
                }
                
                payments.push(payment);
                currentDate = addMonths(currentDate, 12);
            }
            break;
    }
    await updatePaymentStatus(payments);
    return Parse.Object.saveAll(payments);
}

function addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    return newDate;
}

// function generatePayment(contract:Contract,paymentDate:Date){
//     const payment = new Payment();
//     payment.contract = contract;
//     payment.amount = contract.get("rentAmount");
//     payment.status = "Pending";
//     payment.paidAmount = 0;
//     payment.dueDate = paymentDate;
//     payment.paidDate = null
//     return payment;
// }
