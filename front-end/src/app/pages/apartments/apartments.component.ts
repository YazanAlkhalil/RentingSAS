import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { Apartment } from "../../models/Interfaces/Apartment";
import { TranslateModule } from "@ngx-translate/core";
import { InputTextModule } from "primeng/inputtext";
import {
  FormArray,
  FormControl,
  FormGroup,
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
import { AuthService } from "../../services/other/auth.service";
import { BuildingService } from "../../services/dataServices/building.service";
import { Contract } from "../../models/Contract";
import { MultiSelectModule } from "primeng/multiselect";
import { ContractService } from "../../services/dataServices/contract.service";
import { CalendarModule } from "primeng/calendar";

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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: "./apartments.component.html",
  styleUrl: "./apartments.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApartmentsComponent {
  selectedApartments!: [];
  apartmentDialog: boolean = false;
  apartments!: {
    buildingName: string;
    buildingId: string;
    apartment: Apartment;
  }[];
  selectedApartment!: {
    buildingName: string;
    buildingId: string;
    apartment: Apartment;
  };
  buildings!: Building[];
  dropdownBuildings: { name: string; id: string }[] = [];
  selectedBuilding: Building = new Building();
  apartment!: Apartment;
  submitted: boolean = false;
  selectedPaymentFrequency!: string;
  data: {
    skip: number;
    limit: number;
    searchValue: string;
    sortField: string;
    withCount: boolean;
    company_id: Parse.Pointer;
  } = {
    skip: 0,
    limit: 5,
    searchValue: "",
    sortField: "name",
    withCount: false,
    company_id: this.authService.getCurrentUser()?.get("company_id"),
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
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private msg: MessageService,
    private buildingService: BuildingService,
    private confirmationService: ConfirmationService,
    private contractService: ContractService
  ) {}
  ngOnInit() {
    this.buildingService.getBuildings(this.data).then((data) => {
      this.buildings = data;
      this.apartments = [];
      console.log(data);
      data.forEach((building) => {
        this.dropdownBuildings.push({
          name: building.get("name"),
          id: building.id,
        });
      });
      data.forEach((building) =>
        building.apartment.forEach((apartment) => {
          this.apartments.push({
            buildingName: building.name,
            buildingId: building.id,
            apartment: apartment,
          });
        })
      );
      this.apartments = [...this.apartments];
      this.cd.detectChanges();
    });
  }
  openNew() {
    this.apartmentDialog = true;
    this.apartment = {
      _id: this.createId(),
      number: "",
      floor: 0,
      size: "",
      bedroom: 0,
      bathroom: 0,
      amenities: [],
      isFurnished: false,
      status: "available",
      description: "",
      img: [],
      rentPrice: "",
    };
    this.submitted = false;
  }

  deleteSelectedApartments() {}

  hideDialog() {
    this.apartmentDialog = false;
    this.submitted = false;
    this.buildingService.getBuildings(this.data);
    this.cd.detectChanges();
  }
  saveApartment() {
    this.submitted = true;
    console.log(this.buildings, "vvs");
    if (
      this.apartment.number &&
      this.apartment.floor &&
      this.apartment.bathroom &&
      this.apartment.bedroom
    ) {
      const building = this.buildings.find(
        (building) => this.selectedBuilding.id === building.id
      );
      if (building) {
        building.apartment.push(this.apartment);
        building.save();
        this.cd.detectChanges();
      }
      this.msg.add({
        severity: "success",
        summary: "Successful",
        detail: "Building Updated",
        life: 3000,
      });
      this.apartmentDialog = false;
    }
    this.buildings = [...this.buildings];
    this.cd.detectChanges();
  }
  editApartment(apartment: Apartment) {
    this.apartment = apartment;
    console.log(this.apartment, "app");
    this.apartmentDialog = true;
  }

  deleteApartment(apartment: Apartment) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this apartment ?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const building = this.buildings.find(
          (building) => building.id === apartment["buildingId"]
        );
        if (building) {
          const apartmentIndex = building.apartment.findIndex(
            (apartment) => apartment["id"] === apartment["id"]
          );
          if (apartmentIndex !== -1) {
            building.apartment.splice(apartmentIndex, 1);
            building.save();
            this.msg.add({
              severity: "success",
              summary: "Successful",
              detail: "Apartment Deleted",
              life: 3000,
            });
            this.buildings = [...this.buildings];
            this.cd.detectChanges();
          }
        }
      },
    });
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    const parseFile = new Parse.File(file.name, file);
    this.apartment.img.push(parseFile);
    console.log(this.apartment.img, "imgs");
  }

  createId(): string {
    let id = "";
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  cancel(): void {
    this.submitted = false;
    this.contract.revert();
    this.contractDialog = false;
  }

  addContract(apartment: {
    apartment: Apartment;
    buildingId: string;
    buildingName: string;
  }) {
    this.contractDialog = true;
    this.contract = new Contract();
    this.submitted = false;
    this.selectedApartment = apartment;
  }
  saveContract() {
    if (
      this.contract.startDate &&
      this.contract.endDate &&
      this.contract.rentAmount &&
      this.contract.deposit &&
      this.contract.paymentFrequency &&
      this.contract.client.name &&
      this.contract.client.contactInfo.email &&
      this.contract.client.contactInfo.phone
    ) {
      this.contractService.addContract(this.contract, this.selectedApartment);
      console.log(this.contract, "contract");
      this.msg.add({
        severity: "success",
        summary: "Successful",
        detail: "Contract Updated",
        life: 3000,
      });
      this.contractDialog = false;
    }
  }
  formVisible() {
    this.isContract = !this.isContract;
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
      accept: () => {
        this.contractService.deleteContract(this.contract);
        this.msg.add({
          severity: "success",
          summary: "Successful",
          detail: "Contract Deleted",
          life: 3000,
        });
      },
    });
  }
  // contractInfos() {
  //   if (
  //     this.contract.startDate !== null &&
  //     this.contract.endDate !== null &&
  //     this.contract.rentAmount !== null &&
  //     this.contract.deposit !== null &&
  //     this.contract.paymentFrequency !== null &&
  //     this.contract.client.name !== null &&
  //     this.contract.client.contactInfo.email !== null &&
  //     this.contract.client.contactInfo.phone !== null 
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
