import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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

@Component({
  selector: "app-apartments",
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: "./apartments.component.html",
  styleUrl: "./apartments.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentsComponent {
  selectedApartments!: [];
  apartmentDialog: boolean = false;
  apartments: Apartment[] = [];
  selectedApartment!: {
    buildingName: string;
    buildingId: string;
    apartment: Apartment;
  };
  buildings!: Building[];
  dropdownBuildings: { name: string; id: string }[] = [];
  selectedBuilding!: { name: string; id: string };
  apartment!: Apartment;
  submitted: boolean = false;
  selectedPaymentFrequency!: string;
  moreDetailsDialog: boolean = false;
  amenitiesOptions = [
    { name: "Air Conditioning", value: "Air Conditioning" },
    { name: "Balcony", value: "Balcony" },
    { name: "Dishwasher", value: "Dishwasher" },
    { name: "Parking", value: "Parking" },
    { name: "Pool", value: "Pool" },
    { name: "Washer/Dryer", value: "Washer/Dryer" },
    { name: "WiFi", value: "WiFi" },
    { name: "Fridge", value: "Fridge" },
    { name: "Microwave", value: "Microwave" },
    { name: "Oven", value: "Oven" },
    { name: "Stove", value: "Stove" },
    { name: "TV", value: "TV" },
    { name: "Internet", value: "Internet" },
  ];
  selectedAmenities: string[] = [];
  maintenanceExpenseDialog: boolean = false
  maintenanceExpense: Expenses = new Expenses()
  apartmentStateOptions = [
    { name: 'Available', value: 'available' },
    { name: 'Under Maintenance', value: 'underMaintenance' },
  ];
  selectedApartmentState: string = '';
  data: {
    skip: number;
    limit: number;
    searchValue: string;
    sortField: string;
    withCount: boolean;
  } = {
    skip: 0,
    limit: 5,
    searchValue: "",
    sortField: "name",
    withCount: false,
  };

  contract: Contract = new Contract();
  contractDialog = false;
  utilitiesToPayOptions = [
    { name: "Electricity", value: "Electricity" },
    { name: "Water", value: "Water" },
    { name: "Telephone", value: "Telephone" },
    { name: "Internet", value: "Internet" },
  ];
  paymentFrequencyOptions = [
    { name: "Monthly", value: "Monthly" },
    { name: "Trimonthly", value: "Trimonthly" },
    { name: "SemiAnnually", value: "SemiAnnually" },
    { name: "Annually", value: "Annually" },
  ];
  isContract: boolean = false;
  constructor(
    private apartmentService: ApartmentService,
    private cd: ChangeDetectorRef,
    private msg: MessageService,
    private buildingService: BuildingService,
    private confirmationService: ConfirmationService,
    private contractService: ContractService
  ) { }
  ngOnInit() {
    this.getApartments();
  }

  getApartments() {
    this.buildingService.getBuildings(this.data).then((data) => {
      this.buildings = data;
      this.dropdownBuildings = [];
      data.forEach((building) => {
        this.dropdownBuildings.push({
          name: building.get("name"),
          id: building.id,
        });
      });
      console.log(this.dropdownBuildings, "dbs");
      this.apartmentService.getApartments(this.data).then((data) => {
        this.apartments = data;
        console.log(this.apartments,'aps')        
        this.apartments = [...this.apartments];
        this.cd.detectChanges();
      });
    });
  }
  openNew() {
    this.apartmentDialog = true;
    this.apartment = new Apartment();
    this.apartment.status = 'available'
    this.submitted = false;
    this.selectedAmenities = [];
  }

  deleteSelectedApartments() {}


  openMaintenanceExpenseDialog(){
    this.maintenanceExpense = new Expenses()
    this.maintenanceExpense.type = 'Maintenance'
    this.maintenanceExpenseDialog = true
  }

  hideMaintenanceExpenseDialog(){
    this.maintenanceExpenseDialog = false
  }

  saveMaintenanceExpense(){
    this.maintenanceExpense.save().then(() => {
      this.maintenanceExpenseDialog = false
    }).catch((err:any) => {
      this.msg.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 3000,
      });
    })
  }
  moreDetails(apartment: Apartment) {
    console.log(apartment , 'ss');

    this.apartment = apartment
    this.moreDetailsDialog = true
  }

  hideDialog() {
    this.apartmentDialog = false;
    this.submitted = false;
    this.getApartments();
    this.cd.detectChanges();
  }
  async saveApartment() {
    console.log("apartment saved");
    this.submitted = true;

    if (
      this.apartment.number &&
      this.apartment.floor &&
      this.apartment.bathroom &&
      this.apartment.bedroom
    ) {

      const buildingPointer = new Building()
      buildingPointer.id = this.selectedBuilding.id
      this.apartment.building = buildingPointer 
      this.apartment.amenities = this.selectedAmenities 
      this.apartmentService.addApartment(this.apartment).then(() => {
        this.msg.add({
          severity: "success",
          summary: "Successful",
          detail: "Apartment Added",
          life: 3000,
        });
        this.apartmentDialog = false;
        this.getApartments();
        this.cd.detectChanges();
      });
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
    this.selectedAmenities = apartment.amenities;
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

  onImageUpload(event: any) {
    const file = event.files[0];
    const parseFile = new Parse.File(file.name, file);
    this.apartment.imgs.push(parseFile);
    console.log(this.apartment.imgs, "imgs");
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

  addContract(apartment: {
    apartment: Apartment;
    buildingId: string;
    buildingName: string;
  }) {
    const contractQuery = new Parse.Query(Contract);
    contractQuery.equalTo("apartment", apartment.apartment.id);
    contractQuery.first().then((contract: Contract | undefined) => {
      if (contract) {
        this.contract = contract;
        this.selectedPaymentFrequency = contract.get('paymentFrequency')
        this.isContract = true;
        this.contractDialog = true;
        this.cd.detectChanges();
      } else {
        this.contractDialog = true;
        this.contract = new Contract();
        this.selectedPaymentFrequency = ''
        this.isContract = false
        this.cd.detectChanges()
      }
    });
    this.submitted = false;
    this.selectedApartment = apartment;
    this.cd.detectChanges();
  }
  saveContract() {
    this.submitted = true;
    if (
      this.contract.get("startDate") &&
      this.contract.get("endDate") &&
      this.contract.get("rentAmount") &&
      this.selectedPaymentFrequency &&
      this.contract.get("client").name &&
      this.contract.get("client").contactInfo.email &&
      this.contract.get("client").contactInfo.phone
    ) {
      if (this.contract.id) {
        this.contract.set('paymentFrequency', this.selectedPaymentFrequency)
        this.contract.save().then(() => {
          this.contractDialog = false;
          this.msg.add({
            severity: "success",
            summary: "Successful",
            detail: "Contract Updated",
            life: 3000,
          });
          this.cd.detectChanges();
        });
        return;
      }
      // this.contractService.addContract(this.contract, this.selectedApartment);
      // console.log(this.contract, "contract");
      this.msg.add({
        severity: "success",
        summary: "Successful",
        detail: "Contract Created",
        life: 3000,
      });
      this.contractDialog = false;
    }
  }
  formVisible() {
    this.isContract = true;
    console.log(this.isContract, "css");
  }
  editContract(contract: Contract) {
    this.contract = contract;
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
          this.contractDialog = false;
          this.msg.add({
            severity: "success",
            summary: "Successful",
            detail: "Contract Deleted",
            life: 3000,
          });
          this.isContract = false;
          this.cd.detectChanges();
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
      this.contract.get("startDate") &&
      this.contract.get("endDate") &&
      this.contract.get("rentAmount") &&
      this.selectedPaymentFrequency &&
      this.contract.get("client").name &&
      this.contract.get("client").contactInfo.email &&
      this.contract.get("client").contactInfo.phone
    )
  }
}
