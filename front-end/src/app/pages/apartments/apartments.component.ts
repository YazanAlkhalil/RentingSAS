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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  buildings!: Building[];
  dropdownBuildings: { name: string; id: string }[] = [];
  selectedBuilding: Building = new Building();
  apartment!: Apartment;
  submitted: boolean = false;

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
  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private msg: MessageService,
    private buildingService: BuildingService,
    private confirmationService: ConfirmationService
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
      console.log(this.apartments, "aps");
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
      status: "",
      description: "",
      img: [],
      rentPrice: "",
    };
    this.submitted = false;
  }

  deleteSelectedApartments() {}

  addNewApartment() {
    const newApartment: Apartment = {
      _id: this.createId(),
      number: "",
      floor: 0,
      size: "",
      bedroom: 0,
      bathroom: 0,
      amenities: [],
      isFurnished: false,
      status: "",
      description: "",
      img: this.apartment.img,
      rentPrice: "",
    };
  }
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
        this.cd.detectChanges()
      }
      this.msg.add({
        severity: "success",
        summary: "Successful",
        detail: "Building Updated",
        life: 3000,
      });
      this.apartmentDialog = false;
    }
    this.buildings = [... this.buildings]
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
            this.buildings = [... this.buildings]
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
}
