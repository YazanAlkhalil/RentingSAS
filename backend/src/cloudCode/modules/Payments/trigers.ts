import { Payment } from "../../models/Payment";
import { Contract } from "../../models/Contract";
import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { PaymentStatusCodes } from "../../utils/statusCodesMaps";


Parse.Cloud.afterSave(Payment, async (request) => {
    const payment = request.object;
    const sessionToken = request.user?.getSessionToken();
    if(!payment.existed()){
        const contractId = payment.get("contract")?.id;
        if(contractId){
            const contract = await new Parse.Query(Contract).get(contractId,{sessionToken});
            if(contract){
                const apartmentId = contract.get("apartment")?.id;
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
                            payment.setACL(acl);
                            await payment.save(null, {sessionToken});
                        }
                    }
                }
            }
        }
    }
});


Parse.Cloud.define('updatePaymentStatus', async () => {
    const payments = await new Parse.Query(Payment)
    .include("contract")
    .notContainedIn("status", ["Paid","Overdue"])
    .equalTo("isArchived", false)
    .find({useMasterKey: true});
    updatePaymentStatus(payments);



    // //update Contract status
    // const currentDate = new Date();
    // const contracts = await new Parse.Query(Contract)
    // .equalTo("isArchived",false)
    // .equalTo("isExpired",false)
    // .find({useMasterKey: true});
    // for(const contract of contracts){
    //     if(currentDate >= contract.endDate){
    //         contract.isExpired = true;
    //         contract.save(null, {useMasterKey: true});
    //     }
    // }    
});

function addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}


export async function updatePaymentStatus(payments:Payment[]){
    const currentDate = new Date();
    
    for(const payment of payments){
        const dueDate = payment?.get("dueDate");
        const overDuePeriodDays = payment?.get("contract")?.get("overDuePeriodDays") || 14;

        const currentDateUTC = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());
        const dueDateUTC = new Date(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
        const overdueDateUTC = addDays(dueDateUTC, overDuePeriodDays);
        


        if(currentDateUTC >= overdueDateUTC){
            payment.status = "Overdue";
            payment.statusCode = PaymentStatusCodes.Overdue;
            await payment.save(null, {useMasterKey: true, silent: true});
        }else if(currentDateUTC >= dueDateUTC){
            payment.status = "Due";
            payment.statusCode = PaymentStatusCodes.Due;
            await payment.save(null, {useMasterKey: true, silent: true});
        }
    }
}


