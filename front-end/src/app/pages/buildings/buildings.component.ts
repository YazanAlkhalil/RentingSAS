import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "app-buildings",
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
    FormsModule,
    FileUploadModule
  ],
  templateUrl: "./buildings.component.html",
  styleUrl: "./buildings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsComponent {
  buildingDialog: boolean = false;
  buildings!: Building[];
  building!: Building;
  submitted: boolean = false;
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
    withCount: true,
  };
  constructor(
    private buildingService: BuildingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cd.detectChanges()
    this.buildingService.getBuildings(this.data).then((data) => {
      if ("results" in data) {
        this.buildings = data.results;
      } else {
        this.buildings = data;
      }
      console.log("data", this.buildings);
      this.cd.detectChanges()
    });
  }

  openNew() {
    this.building = new Building();
    this.submitted = false;
    this.buildingDialog = true;
  }

  deleteSelectedBuildings() {
    
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected buildings?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.buildings = this.buildings.filter(
          (val) => !this.selectedBuildings?.includes(val)
        );
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
      message: 'Are you sure you want to delete ' + building.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.buildingService.deleteBuilding(building)
          this.buildingService.getBuildings(this.data)
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Deleted', life: 3000 });
        } catch (error) {
          console.error('Error deleting building:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete building',
            life: 3000
          })
        }
      }
    });
  }

  hideDialog() {
    this.buildingDialog = false;
    this.submitted = false;
  }

  saveBuilding() {
    this.submitted = true;
    if (this.building.name?.trim()) {
      if (this.building.id) {
        this.buildings[this.findIndexById(this.building.id)] = this.building;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        this.building.img = "product-placeholder.svg";
        this.buildings.push(this.building);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      this.buildings = [...this.buildings];
      this.buildingDialog = false;
      this.building = new Building();
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.buildings.length; i++) {
      if (this.buildings[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
