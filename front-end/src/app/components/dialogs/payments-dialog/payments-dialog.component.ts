import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Contract } from '../../../models/Contract';
import { Payment } from '../../../models/Payment';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/dataServices/payment.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-payments-dialog',
  standalone: true,
  imports: [TableModule,
    ToolbarModule,
    ButtonModule,
    ConfirmDialogModule,
    DatePipe,
    DialogModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,

  ],
  templateUrl: './payments-dialog.component.html',
  styleUrl: './payments-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService]
})
export class PaymentsDialogComponent {
  payments: Payment[] = []
  contract!: Contract
  paymentsDialog: boolean = false
  payment: Payment = new Payment()
  paymentStatusOptions = [
    "Paid",
    "Overdue",
    "Due",
    "Pending",
  ]
  paymentMethods: string[] = [
    "Cash",
    "Bank Transfer",
    "Check",
    "Credit Card",
    "Debit Card",
    "Other"
  ];

  constructor(
    public config: DynamicDialogConfig,
    private cd: ChangeDetectorRef,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    if (this.config.data) {
      this.payments = this.config.data.payments || [];
      this.contract = this.config.data.contract;
    }
    console.log(this.payments, 'paymentsss');
  }
  editPayment(payment: Payment) {
    this.payment = payment
    this.paymentsDialog = true
    this.cd.detectChanges()
  }

  deletePayment(payment: Payment) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this payment?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(payment, 'payment')
        this.paymentService.deletePayment(payment.id).then(() => {
          this.paymentService.getPayments(this.contract.id).then((data) => {
            this.payments = data
            console.log(this.payments, 'payments')
            this.cd.detectChanges()
          })
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Deleted', life: 3000 });
        })
      }
    });
  }
  openNewPayment() {
    this.payment = new Payment();
    this.paymentsDialog = true;
  }

  onPaymentStatusChange() {
    if (this.payment.status === 'Paid') {
      this.payment.paidDate = new Date();
      this.payment.paidAmount = this.payment.amount
    }
  }

  hidePaymentsDialog() {
    this.paymentsDialog = false
    this.payment.revert()
    this.cd.detectChanges()
  }

  savePayment() {
    if (this.payment.id) {
      this.paymentService.updatePayment(this.payment).then(() => {
        this.paymentsDialog = false
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
        this.cd.detectChanges()
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      })
    } else {
      this.paymentService.createPayment(this.payment, this.contract.id).then(() => {
        this.paymentsDialog = false
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
        this.cd.detectChanges()
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      })
    }
    this.paymentService.getPayments(this.contract.id).then((data) => {
      this.payments = data
      this.cd.detectChanges()
    })
  }
}
