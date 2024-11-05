import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { Apartment } from "../../models/Apartment";
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import {

  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ImageModule } from "primeng/image";
import { Building } from "../../models/Building";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmationService, MessageService } from "primeng/api";
import Parse from "parse";
import { BuildingService } from "../../services/dataServices/building.service";
import { Contract } from "../../models/Contract";
import { MultiSelectModule } from "primeng/multiselect";
import { ContractService } from "../../services/dataServices/contract.service";
import { CalendarModule } from "primeng/calendar";
import { CarouselModule } from "primeng/carousel";
import { Expenses } from "../../models/Expenses";
import { ApartmentService } from "../../services/dataServices/apartment.service";
import { ClientService } from "../../services/dataServices/client.service";
import { Client } from "../../models/Client";
import { debounceTime, fromEvent, Subscription } from "rxjs";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: "app-apartments",
  standalone: true,
  imports: [
    TranslateModule,
    ToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextareaModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ImageModule,
    CheckboxModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    CarouselModule,
    PaginatorModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: "./apartments.component.html",
  styleUrl: "./apartments.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentsComponent implements AfterViewInit {
  selectedApartments!: [];
  apartmentDialog: boolean = false;
  apartments: Apartment[] = [];
  estimatedRentPrices: number[] = [];
  buildings!: Building[];
  selectedClient!: Client;
  dropdownBuildings: { name: string; id: string }[] = [];
  selectedBuilding!: { name: string; id: string };
  apartment: Apartment = new Apartment();
  submitted: boolean = false;
  paymentFrequencyOptions = [
    "Monthly",
    "Trimonthly",
    "SemiAnnually",
    "Annually",
  ];
  moreDetailsDialog: boolean = false;
  amenitiesOptions = [
    "Air Conditioning",
    "Balcony",
    "Dishwasher",
    "Parking",
    "Pool",
    "Washer/Dryer",
    "WiFi",
    "Fridge",
    "Microwave",
    "Oven",
    "Stove",
    "TV",
    "Internet",
  ];
  maintenanceExpenseDialog: boolean = false
  maintenanceExpense: Expenses = new Expenses()
  apartmentStateOptions = [
    {name: 'vacant',
      code: '2'
    },
    {
      name: 'disabled',
      code: '3'
    },
  ];
  data: {
    pageIndex: number;
    pageSize: number;
    searchValue?: string;
    sortField?: string;
    sortOrder: number;
    withCount?: boolean;
  } = {
    pageIndex: 0,
    pageSize: 10,
    searchValue: "",
    withCount: true,
    sortOrder: 1
  };
  typeOptions = [
    'Advance',
    'Postpaid',
  ]
  contract: Contract = new Contract();
  contractDialog = false;
  utilitiesToPayOptions = [
    "Electricity",
    "Water",
    "Telephone",
    "Internet",
  ];
  clients: Client[] = []
  isContract: boolean = false;
  contractExists: boolean = false;
  totalRecords!: number;
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchSubscription!: Subscription;
  loading = true;

  constructor(
    private apartmentService: ApartmentService,
    private cd: ChangeDetectorRef,
    private msg: MessageService,
    private buildingService: BuildingService,
    private confirmationService: ConfirmationService,
    private contractService: ContractService,
    private clientService: ClientService
  ) { }
  ngOnInit() {
    Promise.all([this.getBuildings(), this.getClients(), this.getApartments()]).then(()=>{
      this.loading = false;
      this.cd.detectChanges();
    }).catch((err: any)=>{
      this.msg.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 3000,
      });
    })
  }

  ngAfterViewInit() {
    this.searchSetup();
  }
  
  
  onPage(event: any) {
    this.data.pageIndex = event.first;
    this.data.pageSize = event.rows;
    this.getApartments();
    this.cd.detectChanges();
  }
  searchSetup() {
    this.searchSubscription = fromEvent(this.searchInput.nativeElement, "keyup")
      .pipe(debounceTime(500))
      .subscribe((event: any) => {
        const target = event.target as HTMLInputElement;
        this.data.searchValue = target.value;
        console.log("search", this.data.searchValue)
        this.getApartments();
      });
  }

  getClients(){
    return this.clientService.getClients({}).then((data)=>{
      this.clients = data
      console.log(this.clients, 'clients')
    })
  }
  onApartmentStateChange(){
    this.apartmentService.updateApartment(this.apartment).then(()=>{
      this.msg.add({
        severity: "success",
        summary: "Successful",
        detail: "Apartment State Updated",
        life: 3000,
      });
    }).catch((err: any)=>{
      this.msg.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 3000,
      });
    })
  }

  getBuildings(){
   return this.buildingService.getBuildings({}).then((data) => {
      this.buildings = data;
      this.dropdownBuildings = [];
      data.forEach((building) => {
        this.dropdownBuildings.push({
          name: building.get("name"),
          id: building.id,
        });
      });
    })
  }

  getApartments() {
    return this.apartmentService.getApartments(this.data).then((data) => {
        this.apartments = data.results.map((apartment:any) => apartment.apartment);
        this.estimatedRentPrices = data.results.map((apartment:any) => apartment.EstimatedRentPrice);
        console.log(this.apartments, 'aps')
        this.totalRecords = data.count;
        this.cd.detectChanges();
      })
  }

  openNew() {
    this.apartmentDialog = true;
    this.apartment = new Apartment();
    this.apartment.status = 'vacant'
    this.submitted = false;
  }

  deleteSelectedApartments() { }


  openMaintenanceExpenseDialog() {
    this.maintenanceExpense = new Expenses()
    this.maintenanceExpense.type = 'Maintenance'
    this.maintenanceExpenseDialog = true
  }

  hideMaintenanceExpenseDialog() {
    this.maintenanceExpenseDialog = false
  }

  saveMaintenanceExpense() {
    this.maintenanceExpense.save().then(() => {
      this.maintenanceExpenseDialog = false
    }).catch((err: any) => {
      this.msg.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 3000,
      });
    })
  }
  moreDetails(apartment: Apartment) {
    this.apartment = apartment
    console.log(this.apartment, 'ss');
    this.moreDetailsDialog = true
    this.cd.detectChanges();

  }

  hideDialog() {
    this.apartmentDialog = false;
    this.submitted = false;
    this.getApartments();
    this.cd.detectChanges();
  }
  async saveApartment() {
    this.submitted = true;

    if (
      this.apartment.name &&
      this.selectedBuilding
    ) {
    
      const buildingPointer = new Building()
      buildingPointer.id = this.selectedBuilding.id
      this.apartment.building = buildingPointer
      if(this.apartment.id){
        this.apartmentService.updateApartment(this.apartment).then(() => {
          this.msg.add({
            severity: "success",
            summary: "Successful",
            detail: "Apartment Updated",
            life: 3000,
          });
        })
      }else{
      this.apartmentService.addApartment(this.apartment).then(() => {
        this.msg.add({
          severity: "success",
          summary: "Successful",
          detail: "Apartment Added",
          life: 3000,
        });
      });
    }
    this.apartmentDialog = false;
    this.getApartments();
    this.cd.detectChanges();
    }
  }
  editApartment(apartment: Apartment) {
    console.log(apartment.building, "building");
    this.selectedBuilding = {
      name: apartment.building.name,
      id: apartment.building.id,
    };
    console.log(this.selectedBuilding, "apartment");

    this.apartment = apartment;
    console.log(this.apartment, "app");
    this.apartmentDialog = true;
  }

  deleteApartment(apartment: Apartment) {
    console.log(apartment, "ap");
    this.apartment = apartment
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this apartment ?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.apartmentService.deleteApartment(this.apartment);
        this.msg.add({
          severity: "success",
          summary: "Successful",
          detail: "Apartment Deleted",
          life: 3000,
        });
        this.getApartments();
        this.cd.detectChanges();
      },
    });
  }

  async onImageUpload(event: any) {
    const file = event.files[0];
    const uniqueFileName = `${Date.now()}`;
    const parseFile = new Parse.File(uniqueFileName, file);
    await parseFile.save();
    console.log(this.apartment.imgs, 'imgs');
    if (this.apartment.imgs?.length > 0) {
      this.apartment.imgs.push(parseFile);
    } else {
      this.apartment.imgs = [parseFile];
    }
    this.apartment.imgs = [...this.apartment.imgs]
    console.log(this.apartment.imgs, 'imgs');
    this.cd.detectChanges();
  }
  async onImageRemove(event:any){

  }
  deleteImage(index: number) {
    this.apartment.imgs.splice(index, 1);
  }

  cancel(): void {
    this.submitted = false;
    this.contract.revert();
    this.isContract = false;
    this.contractDialog = false;
  }

  addContract(apartment: Apartment
  ) {
    this.apartment = apartment

    Parse.Cloud.run("getContract", { apartmentId: apartment.id }).then((result: {contract:Contract,client:Client} | null) => {
      if (result?.contract) {
        this.contract = result.contract;
        this.selectedClient = this.clients.find(cl => cl.id === result.client.id) ?? new Client()
        this.isContract = true;
        this.contractExists = true;
        this.contractDialog = true;
        
        this.cd.detectChanges();
      } else {
        this.contractDialog = true;
        this.contract = new Contract();
        this.selectedClient = new Client()
        this.isContract = false
        this.contractExists = false;
        this.cd.detectChanges()
      }
    });
    this.submitted = false;
    this.cd.detectChanges();
  }
  saveContract() {
    this.submitted = true;
    if (
      this.contract.get("startDate") &&
      this.contract.get("endDate") &&
      this.contract.get("rentAmount") &&
      this.contract.get("paymentFrequency") &&
      this.selectedClient
    ) {
      if (this.contract.id) {
        this.contractService.updateContract(
          this.contract,
          this.selectedClient
        ).then(() => {
          this.contractDialog = false;
          this.msg.add({
            severity: "success",
            summary: "Successful",
            detail: "Contract Updated",
            life: 3000,
          });
        });
        this.getApartments();
        this.submitted = false;
        return;
      }
      this.contract.client = this.selectedClient
      this.contractService.addContract(this.contract, this.apartment);
      console.log(this.contract, "contract");
      this.getApartments();
      this.msg.add({
        severity: "success",
        summary: "Successful",
        detail: "Contract Created",
        life: 3000,
      });
      this.contractDialog = false;
      this.submitted = false;
    }
  }
  formVisible() {
    this.isContract = true;
    console.log(this.isContract, "css");
  }
  
  deleteContract() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this contract ?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.contractService.deleteContract(this.contract).then(() => {
          
          this.msg.add({
            severity: "success",
            summary: "Successful",
            detail: "Contract Deleted",
            life: 3000,
          });
          this.cancel()
        });
      },
    });
  }
  imagesDialog: boolean = false;

  openImagesDialog() {
    this.imagesDialog = true;
  }
  contractInfos() {
    return (
      this.contract?.get("startDate") &&
      this.contract?.get("endDate") &&
      this.contract?.get("rentAmount") &&
      this.contract?.get("paymentFrequency") &&
      this.contract?.get("client")?.id 
    )
  }

  onSort(event: any) {
    this.data.sortField = event.field;
    this.data.sortOrder = event.order;
    this.getApartments();
    this.cd.detectChanges();
  }
}
