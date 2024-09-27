export interface Payment {
    dueDate: Date;
    amount: string;
    status: string;
    paidDate: Date;
    paidAmount: string;
    paymentMethod: string;
    transaction_id: string;
  }
  