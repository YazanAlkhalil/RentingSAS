import { Apartment } from "../../models/Apartment";
import { Building } from "../../models/Building";
import { Contract } from "../../models/Contract";
import { Payment } from "../../models/Payment";

Parse.Cloud.define("getPaymentPage", async (request) => {

    const sessionToken = request?.user?.getSessionToken();
    const company = request?.user?.get("company");
    const {code} = request.params
    await company.fetch({ sessionToken });
    const counts = {
        TotalPaymentsThisMonth: 0,
        TotalPaymentsLastMonth: 0,
        TotalOverduePaymentsThisMonth: 0,
        TotalOverduePaymentsLastMonth: 0
    };


    const buildingsQuery = new Parse.Query(Building)
        .equalTo("company", company)
        .equalTo("isArchived", false);


    const apartmentsQuery = new Parse.Query(Apartment)
        .matchesQuery("building", buildingsQuery)
        .equalTo("isArchived", false);

    const contractsQuery = new Parse.Query(Contract)
        .matchesQuery("apartment", apartmentsQuery)
        .equalTo("isArchived", false);



    const paymentsQuery = await new Parse.Query(Payment)
        .matchesQuery("contract", contractsQuery)
        .include(['contract.apartment', 'contract.client'])
        .equalTo("isArchived", false)
        .limit(100000000000)
        
    
    let payments = await paymentsQuery.find({ sessionToken });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    payments.forEach(payment => {
        const paidDate = payment.get("paidDate");
        const dueDate = payment.get("dueDate");

        if (paidDate?.getMonth() === currentMonth && paidDate?.getFullYear() === currentYear) {
            counts.TotalPaymentsThisMonth += payment.paidAmount;
        } else if (paidDate?.getMonth() === currentMonth - 1 && paidDate?.getFullYear() === currentYear) {
            counts.TotalPaymentsLastMonth += payment.paidAmount;
        }

        if (dueDate < currentDate && payment.status === 'Overdue') {
            if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear) {
                counts.TotalOverduePaymentsThisMonth += payment.amount;
            } else if (dueDate.getMonth() === currentMonth - 1 && dueDate.getFullYear() === currentYear) {
                counts.TotalOverduePaymentsLastMonth += payment.amount;
            }
        }

    });

    const cards = {
        TotalPaymentsThisMonth: counts.TotalPaymentsThisMonth,
        TotalPaymentsPercentage: calculatePercentage(
            counts.TotalPaymentsThisMonth,
            counts.TotalPaymentsLastMonth
        ),
        didPaymentsIncrease: calculatePercentage(
            counts.TotalPaymentsThisMonth,
            counts.TotalPaymentsLastMonth
        ) > 0,
        TotalOverduePaymentsThisMonth: counts.TotalOverduePaymentsThisMonth,
        TotalOverduePaymentsPercentage: calculatePercentage(
            counts.TotalOverduePaymentsThisMonth,
            counts.TotalOverduePaymentsLastMonth
        ),
        didOverduePaymentsIncrease: calculatePercentage(
            counts.TotalOverduePaymentsThisMonth,
            counts.TotalOverduePaymentsLastMonth
        ) > 0,
    }
    if(code){
       payments = payments.filter(payment => payment.statusCode === code)
    }
    return {
        cards, payments: payments.map(payment => {
            return {
                propertyName: payment.contract.get("apartment").get("name"),
                dueDate: payment.dueDate,
                amount: payment.amount,
                status: payment.status,
                paidDate: payment.paidDate,
                currency: company.currency,
                transactionId: payment.transactionId,
                paymentMethod: payment.paymentMethod,
                tenant: payment.contract.get("client").get("name")
            }
        }
        )
    }



})
function calculatePercentage(currentValue: number, previousValue: number): number {
    if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
    }
    return ((currentValue - previousValue) / previousValue) * 100;
}


