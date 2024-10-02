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
import { CarouselModule } from 'primeng/carousel';
import { MultiSelectModule } from 'primeng/multiselect';

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
    CarouselModule,
    MultiSelectModule
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
  selectedBuilding!:{ name: string; id: string };
  apartment!: Apartment;
  submitted: boolean = false;
  moreDetailsDialog: boolean = false
  amenitiesOptions = [
    { name: 'Air Conditioning', value: 'Air Conditioning' },
    { name: 'Balcony', value: 'Balcony' },
    { name: 'Dishwasher', value: 'Dishwasher' },
    { name: 'Parking', value: 'Parking' },
    { name: 'Pool', value: 'Pool' },
    { name: 'Washer/Dryer', value: 'Washer/Dryer' },
    { name: 'WiFi', value: 'WiFi' },
    { name: 'Fridge', value: 'Fridge' },
    { name: 'Microwave', value: 'Microwave' },
    { name: 'Oven', value: 'Oven' },
    { name: 'Stove', value: 'Stove' },
    { name: 'TV', value: 'TV' },
    { name: 'Internet', value: 'Internet' },
  ];
  selectedAmenities: string[] = [];

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
  ) { }
  ngOnInit() {
    this.getApartments()
  }

  getApartments(){
    this.buildingService.getBuildings(this.data).then((data) => {
      this.buildings = data;
      this.apartments = [];
      this.dropdownBuildings = [] 
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
      _id: "",
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
    this.selectedAmenities = [];
  }

  deleteSelectedApartments() { }

  moreDetails(apartment:{apartment:Apartment}){
    console.log(apartment);
    
    this.apartment = apartment.apartment
    this.moreDetailsDialog = true
  }
 
  hideDialog() {
    console.log(this.apartment);
    console.log(this.buildings);
    
    const buildingIndex = this.buildings.findIndex(building => building.apartment.some(apartment => apartment._id ==this.apartment._id))
    console.log(buildingIndex,'s');
    
    if(buildingIndex !== -1){
      this.buildings[buildingIndex].revert()
    }
    this.getApartments()
    this.apartmentDialog = false;
    this.submitted = false;
    this.buildingService.getBuildings(this.data);
    this.cd.detectChanges();
  }
  async saveApartment() {
    this.submitted = true;
    
    if (
      this.apartment.number &&
      this.apartment.floor &&
      this.apartment.bathroom &&
      this.apartment.bedroom
    ) {
      if(this.apartment._id !==''){
        console.log(this.apartment,'s');
        
        this.buildings.find(building => {
          const apartment = building.apartment.findIndex(apartment => apartment._id ==this.apartment._id)
          if(apartment !== -1){
            this.apartment.amenities = this.selectedAmenities;
            building.apartment[apartment] = this.apartment
            building.save().then(()=>{
              this.apartmentDialog = false;
              this.getApartments()
            }
              
            )
            return true
          }
          return false
        })

      return
      }
      const buildingIndex = this.buildings.findIndex(
        (building) => this.selectedBuilding.id === building.id
      );
      console.log(buildingIndex);
      
      if (buildingIndex !== -1) {
        this.apartment._id = this.createId()
        this.apartment.amenities = this.selectedAmenities;
        this.buildings[buildingIndex].apartment.push(this.apartment);
        await this.buildings[buildingIndex].save()
        const buildingPointer = new Parse.Object('Building')
        buildingPointer.id = this.selectedBuilding.id
        const report = new Parse.Object('Report')
        report.set('apartment_id',this.apartment._id)
        report.set('building_id',buildingPointer)
        report.set('company_id',this.authService.getCurrentUser()?.get('company_id'))
        report.set('user_id',this.authService.getCurrentUser()?.id)
        report.set('type','new_apartment')
        await report.save()
        this.msg.add({
          severity: "success",
          summary: "Successful",
          detail: "Building Updated",
          life: 3000,
        });
        this.apartmentDialog = false;
        this.getApartments()
        this.cd.detectChanges()
      }
    }
  }
  editApartment(apartment: {apartment:Apartment,buildingName:string,buildingId:string}) {
    this.selectedBuilding = {name:apartment.buildingName,id:apartment.buildingId}
    this.apartment = apartment.apartment;
    console.log(this.apartment, "app");
    this.apartmentDialog = true;
    this.selectedAmenities = apartment.apartment.amenities;
  }

  deleteApartment(selectedApartment: {apartment:Apartment,buildingId:string}) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this apartment ?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const building = this.buildings.find(
          (building) => building.id === selectedApartment.buildingId);
        if (building) {
          const apartmentIndex = building.apartment.findIndex(
            (apartment) => apartment._id === selectedApartment.apartment._id
          );
          console.log(building,'s');
          console.log(apartmentIndex,'s');
          
          if (apartmentIndex !== -1) {
            building.apartment.splice(apartmentIndex, 1);
            building.save().then(()=>{
              this.msg.add({
                severity: "success",
                summary: "Successful",
                detail: "Apartment Deleted",
                life: 3000,
              });
              this.getApartments()
              this.cd.detectChanges();
            });
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

  deleteImage(index: number) {
    
        this.apartment.img.splice(index, 1); 
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

  imagesDialog: boolean = false;

  openImagesDialog() {
    this.imagesDialog = true;
  }
}
