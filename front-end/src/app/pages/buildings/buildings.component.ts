import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToolbarModule } from "primeng/toolbar";
import { FileUploadModule } from "primeng/fileupload";
import { ToastModule } from "primeng/toast";
import { Building } from "../../models/Building";
import { ConfirmationService, MessageService } from "primeng/api";
import { BuildingService } from "../../services/dataServices/building.service";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AuthService } from "../../services/other/auth.service";
import { File } from "parse";
import { ImageModule } from "primeng/image";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PaginatorModule } from "primeng/paginator";

@Component({
  selector: "app-buildings",
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule,
    ToastModule,
    TableModule,
    DialogModule,
    InputTextareaModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    FileUploadModule,
    ImageModule,
    PaginatorModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: "./buildings.component.html",
  styleUrl: "./buildings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsComponent {
  buildingDialog: boolean = false;
  buildings: Building[] = [];
  buildingsName: any[] = []
  building: Building = new Building();
  submitted: boolean = false;
  skip: number = 0;
  limit: number = 10;
  statuses!: any[];
  selectedBuildings!: Building[] | null;
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
  constructor(
    private buildingService: BuildingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  getBuildings() : Building[]{
    this.buildingService
      .getBuildings(this.data)
      .then((data: Building[]) => {
          this.buildings = data;
           this.buildingsName = data.map( x =>x.get('name'))   
        this.cd.detectChanges();
        console.log(this.buildings,'bds');
        console.log(this.buildingsName,'names');
      });
      return this.buildings
  }
  ngOnInit() {
    this.getBuildings();
    this.authService.getCurrentUser();
    console.log(this.authService.getCurrentUser()?.get('username'),'user');
    console.log(this.authService.getCurrentUser() ,'user');
    console.log(this.authService.getCurrentUser()?.get('contactInfo').phone,'user');
  }

  openNew() {
    this.building = new Building();
    console.log(this.building , 'll');
    
    this.building.location.longitude = ''
    this.building.location.latitude = ''
    console.log(this.building,'bb');
    this.submitted = false;
    this.buildingDialog = true;
  }

  onPageChange(event: any) {
    this.skip = event.first;
    this.limit = event.rows;
    this.getBuildings();
  }

  deleteSelectedBuildings() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected buildings?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.buildings = this.buildings.filter(
          (val) => !this.selectedBuildings?.includes(val)
        );
        this.selectedBuildings!.forEach( (x) =>this.buildingService.deleteBuilding(x))
        this.selectedBuildings = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Buildings Deleted",
          life: 3000,
        });
      },
    });
  }

  editBuilding(building: Building) {
    this.building = building;
    this.buildingDialog = true;
  }

  deleteBuilding(building: Building) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + building.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          await this.buildingService.deleteBuilding(building);
          this.getBuildings();
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Building Deleted",
            life: 3000,
          });
        } catch (error) {
          console.log("Error deleting building:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete building",
            life: 3000,
          });
        }
      },
    });
  }

  hideDialog() {
    this.building.revert()
    this.buildingDialog = false;
    this.submitted = false;
    this.getBuildings()
    this.cd.detectChanges()
  }
  async saveBuilding() {
    console.log(this.building,'bl');
    
    this.submitted = true;
    if (this.building.name?.trim()) {
      if (this.building.id) {
        await this.building.save();
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Building Updated",
          life: 3000,
        });
      } else {
        try {
          this.buildingService
            .addBuilding(this.building)
            .then((building) => {
              this.buildings.unshift(building);
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Building Created",
                life: 3000,
              });
            }).catch((error:Error | any)=>{
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.message,
                life: 3000,
              });
            })
        } catch (error: Error | any) {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
          });
        }
      }
      this.buildings = [...this.buildings];
      this.buildingDialog = false;
      this.building = new Building();
    }
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    const parseFile = new File(file.name, file);
    this.building.img = parseFile;
  }
}
