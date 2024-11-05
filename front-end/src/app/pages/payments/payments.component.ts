import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Payment } from '../../models/Payment';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaymentService } from '../../services/dataServices/payment.service';
import { Contract } from '../../models/Contract';
import { InputTextModule } from 'primeng/inputtext';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ContractService } from '../../services/dataServices/contract.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    InputTextModule,
    PaginatorModule,
    InputSwitchModule,
    ProgressSpinnerModule
  ],
  templateUrl: './payments.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrl: './payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {

  @ViewChild('searchInput') searchInput!: ElementRef;
  searchSubscription!: Subscription;

  data: {
    pageSize: number;
    pageIndex: number;
    searchValue: string;
    sortField?: string;
    sortOrder: number;
    withCount: boolean;
  } = {
    pageSize: 10,
    pageIndex: 0,
    searchValue: '',
    withCount: true,
    sortField: 'createdAt',
    sortOrder: 1
  };

  count: number = 0;
  payments: Payment[] = [];
  paymentStatusOptions = [
    "Paid",
    "Overdue",
    "Due",
    "Pending",
  ]
  payment = new Payment()
  submitted = false
  paymentsDialog = false
  contract: Contract = new Contract()
  paymentStatusDialog = false;
  selectedPayment: Payment | null = null;
  contracts: Contract[] = [];
  selectedContract: Contract | null = null;
  paymentMethods: string[] = [
    "Cash",
    "Bank Transfer",
    "Check",
    "Credit Card",
    "Debit Card",
    "Other"
  ];
  loading = true;
  

  constructor(private cd: ChangeDetectorRef, private confirmationService: ConfirmationService, private messageService: MessageService, private paymentService: PaymentService, private contractService: ContractService) { }

  ngOnInit() {
    Promise.all([this.getPayments(), this.loadContracts()]).then(() => {
      this.loading = false;
      this.cd.detectChanges();
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    })
  }

  ngAfterViewInit() {
    this.searchSetup();
  }
  async loadContracts() {
    
    try {
      const response = await this.contractService.getContracts({});
      this.contracts = response;
      console.log(this.contracts, 'contracts')
      this.cd.detectChanges();
    } catch (error:any) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });      
    }
  }
  searchSetup() {
    this.searchSubscription = fromEvent(this.searchInput.nativeElement, "keyup")
      .pipe(debounceTime(500))
      .subscribe((event: any) => {
        const target = event.target as HTMLInputElement;
        this.data.searchValue = target.value;
        this.getPayments();
      });
  }

  getPayments() {
    return this.paymentService.getAllPayments(this.data).then((response: { results: Payment[], count: number }) => {
      this.payments = response.results;
      this.count = response.count;
      this.cd.detectChanges();
    });
  }

  onPageChange(event: any) {
    this.data.pageIndex = event.first;
    this.data.pageSize = event.rows;
    this.getPayments();
    this.cd.detectChanges();
  }

  onSort(event: any) {
    this.data.sortField = event.field;
    this.data.sortOrder = event.order;
    this.getPayments();
    this.cd.detectChanges();
  }

  openNewPayment() {
    this.payment = new Payment();
    this.submitted = false;
    this.selectedContract = null;
    this.paymentsDialog = true;
  }

  onPaymentStatusChange() {
    if (this.payment.status === 'Paid') {
      
      this.payment.paidDate = new Date();
      this.payment.paidAmount = this.payment.amount
    }
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
          // this.showPayments(this.contract)
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Deleted', life: 3000 });
        })
      }
    });
  }

  hidePaymentsDialog() {
    this.paymentsDialog = false
    this.payment.revert()
    this.cd.detectChanges()
  }

  async savePayment() {
    if (!this.selectedContract) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select an apartment', life: 3000 });
      return;
    }

    if (this.payment.id) {
      this.paymentService.updatePayment(this.payment).then(() => {
        this.paymentsDialog = false
        this.getPayments()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      })
    } else {
      this.paymentService.createPayment(this.payment, this.selectedContract.id).then(() => {
        this.paymentsDialog = false
        this.getPayments()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
      }).catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      })
    }
  }

  setPaymentStatusToPaid(payment: Payment) {
    this.selectedPayment = payment;
    console.log(this.selectedPayment, 'selectedPayment')
    this.selectedPayment.paidDate = new Date();
    this.selectedPayment.paidAmount = payment.amount;
    this.selectedPayment.isPartiallyPaid = false;
    this.paymentStatusDialog = true;
    this.cd.detectChanges();
  }


  savePaymentStatus() {
    if (!this.selectedPayment) return;
    
    this.selectedPayment.status = 'Paid';

    this.paymentService.updatePayment(this.selectedPayment).then(() => {
      this.paymentStatusDialog = false;
      this.selectedPayment = null;
      this.getPayments();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
    }).catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    });
  }

  hidePaymentStatusDialog() {
    this.paymentStatusDialog = false;
    this.selectedPayment = null;
    this.cd.detectChanges();
  }
}
