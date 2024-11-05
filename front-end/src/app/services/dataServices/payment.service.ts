import { Injectable } from "@angular/core";
import Parse from "parse";
import { Payment } from "../../models/Payment";


@Injectable({
   providedIn: "root",
})
export class PaymentService {
   constructor(

   ) { }

   getPayments(contractId: string) {
      return Parse.Cloud.run("getPaymentsForContract", { contractId });
   }

   deletePayment(paymentId: string) {
      return Parse.Cloud.run("deletePayment", { paymentId });
   }

   createPayment(payment: Payment, contractId: string) {
      return Parse.Cloud.run("createPayment", {
         contractId,
         amount: payment.attributes['amount'],
         status: payment.attributes['status'],
         dueDate: payment.attributes['dueDate'],
         paidAmount: payment.attributes['paidAmount'],
         paidDate: payment.attributes['paidDate'],
         description: payment.attributes['description'],
         paymentMethod: payment.attributes['paymentMethod'],
         transactionId: payment.attributes['transactionId'],
         isPartiallyPaid: payment.attributes['isPartiallyPaid'],
      });
   }

   updatePayment(payment: Payment) {
      return Parse.Cloud.run("updatePayment", {
         paymentId: payment.id,
         amount: payment.attributes['amount'],
         status: payment.attributes['status'],
         dueDate: payment.attributes['dueDate'],
         paidAmount: payment.attributes['paidAmount'],
         paidDate: payment.attributes['paidDate'],
         isPartiallyPaid: payment.attributes['isPartiallyPaid'],
         paymentMethod: payment.attributes['paymentMethod'],
         transactionId: payment.attributes['transactionId'],
      });
   }


   getAllPayments(data: any) {
      return Parse.Cloud.run("getPaymentsForCompany",{data});
   }
}