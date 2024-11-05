import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Contract } from '../../models/Contract'
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ContractService } from '../../services/dataServices/contract.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { Client } from '../../models/Client';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ClientService } from '../../services/dataServices/client.service';
import { Payment } from '../../models/Payment';
import { PaymentService } from '../../services/dataServices/payment.service';
import { DividerModule } from 'primeng/divider';
import { PaymentsDialogComponent } from '../../components/dialogs/payments-dialog/payments-dialog.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
    selector: 'app-contracts',
    standalone: true,
    imports: [
        CommonModule,
        TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, InputTextModule, FormsModule, InputNumberModule, DurationPipe,
        MultiSelectModule, InputTextareaModule, CalendarModule, DividerModule, PaymentsDialogComponent,
        PaginatorModule,
        ProgressSpinnerModule
    ],
    templateUrl: './contracts.component.html',
    styles: [
        `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
    ],
    providers: [MessageService, ConfirmationService, PaymentService, DialogService],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ContractsComponent {
    contractDialog: boolean = false;

    contracts: Contract[] = [];

    contract!: Contract;

    selectedClient!: Client;
    selectedContracts!: any[] | null;

    submitted: boolean = false;

    today = new Date()

    payment: Payment = new Payment()

    paymentsDialog: boolean = false
    typeOptions = [
        'Advance',
        'Postpaid',
    ]
    paymentFrequencyOptions = [
        "Monthly",
        "Trimonthly",
        "SemiAnnually",
        "Annually",
    ]
    utilitiesToPayOptions = [
        "Electricity",
        "Water",
        "Telephone",
        "Internet",
    ];
    clients: Client[] = []
    payments: Payment[] = []
    paymentsTable: boolean = false

    paymentStatusOptions = [
        "Paid",
        "Overdue",
        "Due",
        "Pending",
    ]

    ref: DynamicDialogRef | undefined;

    @ViewChild('searchInput') searchInput!: ElementRef;
    searchSubscription!: Subscription;
    loading = true;

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
        withCount: true,
        searchValue: '',
        sortField: 'createdAt',
        sortOrder: 1
    };

    count: number = 0;

    constructor(private messageService: MessageService, private confirmationService: ConfirmationService, private contractService: ContractService,
        private cd: ChangeDetectorRef,
        private clientService: ClientService,
        private paymentService: PaymentService,
        private dialogService: DialogService
    ) { }

    ngOnInit() {
        Promise.all([this.getContracts(), this.getClients()]).then(() => {
            this.loading = false;
            this.cd.detectChanges();
        }).catch((error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        })
    }

    ngAfterViewInit() {
        this.searchSetup();
    }

    searchSetup() {
        this.searchSubscription = fromEvent(this.searchInput.nativeElement, "keyup")
            .pipe(debounceTime(500))
            .subscribe((event: any) => {
                const target = event.target as HTMLInputElement;
                this.data.searchValue = target.value;
                this.getContracts();
            });
    }

    getContracts() {
        return this.contractService.getContracts(this.data).then((data: { results: Contract[], count: number }) => {
            this.contracts = data.results;
            this.count = data.count;
            this.cd.detectChanges();
        });
    }

    onPageChange(event: any) {
        this.data.pageIndex = event.first;
        this.data.pageSize = event.rows;
        this.getContracts();
    }

    onSort(event: any) {
        this.data.sortField = event.field;
        this.data.sortOrder = event.order;
        this.getContracts();
        this.cd.detectChanges();
    }

    getClients() {
        return this.clientService.getClients({}).then((data) => {
            this.clients = data
            console.log(this.clients, 'clients')
        })
    }

    openNew() {
        this.contract = new Contract();
        this.submitted = false;
        this.contractDialog = true;
    }

    openNewPayment() {
        this.payment = new Payment();
        this.submitted = false;
        this.paymentsDialog = true;
    }
    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected Contract?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedContracts = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
            }
        });
    }

    editContract(contract: Contract) {
        this.contract = contract;
        this.selectedClient = this.clients.find(cl => cl.id === contract.get('client').id) ?? new Client()
        console.log(this.selectedClient, 'selectedClient')
        this.contractDialog = true;
        this.cd.detectChanges()
    }

    deleteContract(contract: Contract) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + contract.get('name') + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.contractService.deleteContract(contract).then(() => {
                    this.getContracts()
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contract Deleted', life: 3000 });
                })
            }
        });
    }

    hideDialog() {
        this.contractDialog = false;
        this.contract.revert()
        this.submitted = false;
    }


    saveContract() {
        this.submitted = true;
        this.contract.client = this.selectedClient
        if (this.contract.id) {
            this.contractService.updateContract(this.contract, this.selectedClient).then(() => {
                this.contractDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contract Updated', life: 3000 });
            })
        }
    }

    showPayments(contract: Contract) {
        this.contract = contract
        return this.paymentService.getPayments(contract.id).then((data) => {
            this.payments = data
            console.log(this.payments, 'payments')
            this.cd.detectChanges()
        })
    }

    

    editPayment(payment: Payment) {
        this.payment = payment
        this.paymentsDialog = true
        this.cd.detectChanges()
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
                this.showPayments(this.contract)
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
            }).catch((error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            })
        } else {
            this.paymentService.createPayment(this.payment, this.contract.id).then(() => {
                this.paymentsDialog = false
                this.showPayments(this.contract)
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Updated', life: 3000 });
            }).catch((error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            })
        }
    }

    onPaymentStatusChange() {
        if (this.payment.status === 'Paid') {
            this.payment.paidDate = new Date();
            this.payment.paidAmount = this.payment.amount
        }
    }

    deletePayment(payment: Payment) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this payment?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log(payment, 'payment')
                this.paymentService.deletePayment(payment.id).then(() => {
                    this.showPayments(this.contract)
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Payment Deleted', life: 3000 });
                })
            }
        });
    }

    async openPaymentsDialog(contract: Contract) {
        await this.showPayments(contract);
        
        if (this.payments && this.contract) {
            this.ref = this.dialogService.open(PaymentsDialogComponent, {
                header: 'Payments',
                width: '70%',
                data: {
                    payments: this.payments,
                    contract: this.contract
                }
            });
            
            this.ref.onClose.subscribe(() => {
                this.goBack();
            });
            
            console.log('Dialog data:', {
                payments: this.payments,
                contract: this.contract
            });
            
            this.cd.detectChanges();
        }
    }

    goBack() {
        this.paymentsTable = false
        this.cd.detectChanges()
    }


}
