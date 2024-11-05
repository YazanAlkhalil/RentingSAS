import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
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
import { InputTextareaModule } from "primeng/inputtextarea";
import { AuthService } from "../../services/other/auth.service";
import { File } from "parse";
import { ImageModule } from "primeng/image";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PaginatorModule } from "primeng/paginator";
import { Company } from "../../models/Company";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import {
  DataUrl,
  NgxImageCompressService,
  UploadResponse,
} from "ngx-image-compress";
import { ImageCropperDialogComponent } from "./image-cropper-dialog/image-cropper-dialog.component";
import { debounceTime, fromEvent, Subscription } from "rxjs";
import { ProgressSpinnerModule } from "primeng/progressspinner";

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
    PaginatorModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: "./buildings.component.html",
  styleUrl: "./buildings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsComponent {
  buildingDialog: boolean = false;
  buildings: Building[] = [];
  buildingsName: any[] = [];
  building: Building = new Building();
  submitted: boolean = false;
  skip: number = 0;
  limit: number = 10;
  statuses!: any[];
  selectedBuildings!: Building[] | null;
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
  count: number = 0
  dataImage: string | null = null;
  heroImages = [
    {
      name:'hero-1',
      img: '../../../assets/images/def1.png',
    },
    {
      name:'hero-2',
      img: '../../../assets/images/def1.png',
    },
  ]
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchSubscription!: Subscription;
  loading = true;

  constructor(
    private buildingService: BuildingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private imageCompress: NgxImageCompressService,
    private dialogService: DialogService
  ) {}
  private imageCropperDialogComponentRef: DynamicDialogRef | undefined;

  getBuildings(){
    this.loading = true;
    this.cd.detectChanges();
    this.buildingService
      .getBuildings(this.data)
      .then((data: Building[] | {count: number, results: Building[]}) => {
        if ('results' in data) {
          this.buildings = data.results;
          this.count = data.count
          this.buildingsName = data.results.map((x: Building) => x.name);
        } else {
          this.buildings = data;
          this.buildingsName = data.map((x: Building) => x.name);
        }
        this.loading = false;
        this.cd.detectChanges();
      });
  }
  ngOnInit() {
    this.getBuildings();
  }

  openNew() {
    this.building = new Building();
    this.building.company = this.authService.getCurrentUser()?.get('company')
    this.building.location.longitude = ''
    this.building.location.latitude = ''
    this.submitted = false;
    this.buildingDialog = true;
  }

  onPageChange(event: any) {
    this.data.pageIndex = event.first;
    this.data.pageSize = event.rows;
    this.getBuildings();
  }

  deleteSelectedBuildings() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected buildings?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      rejectButtonStyleClass: "p-button-secondary p-button-text",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.buildings = this.buildings.filter(
          (val) => !this.selectedBuildings?.includes(val)
        );
        this.selectedBuildings!.forEach((x) =>
          this.buildingService.deleteBuilding(x.id)
        );
        this.selectedBuildings = null;
        this.getBuildings()
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
    this.dataImage = this.building.img ? this.building.img.url() : null;
    this.buildingDialog = true;
  }

  deleteBuilding(building: Building) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + building.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      rejectButtonStyleClass: "p-button-secondary p-button-text",
      acceptButtonStyleClass: "p-button-danger",
      accept: async () => {
        try {
          await this.buildingService.deleteBuilding(building.id);
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
    this.building.revert();
    this.buildingDialog = false;
    this.submitted = false;
    this.getBuildings();
    this.cd.detectChanges();
  }
  async saveBuilding() {
    this.submitted = true;
    if (this.building.name?.trim()) {
      if (this.building.id) {
        await this.buildingService.updateBuilding(this.building);
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
              this.getBuildings()
              this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Building Created",
                life: 3000,
              });
            })
            .catch((error: Error | any) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.message,
                life: 3000,
              });
            });
        } catch (error: Error | any) {
          console.log(error, "error");
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

  changeProfilePic() {
    this.imageCompress.uploadFile().then(async ({ image }: UploadResponse) => {
      this.imageCropperDialogComponentRef = this.dialogService.open(
        ImageCropperDialogComponent,
        {
          header: ".",
          footer: ".",
          data: {
            aspectRatio: 1.5,
            imageBase64: image,
            format: "webp",
            max_image_width: 400,
            maintainAspectRatio: false,
          },
        }
      );
      this.imageCropperDialogComponentRef.onClose.subscribe(async (img) => {
        if (img) {
          console.log(img,'img');
          this.building.img = img;
          this.dataImage = "data:image/jpeg;base64," + img._data;
          this.cd.detectChanges();
        }
      });
    });
    this.dataImage = null;
    this.cd.detectChanges();
  }

  removeProfilePic() {
    this.building.unset("img");
    this.dataImage = "";
    this.cd.detectChanges();
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
        this.getBuildings();
      });
  }

  onSort(event: any) {
    console.log(event,'event');
    this.data.sortField = event.field;
    this.data.sortOrder = event.order;
    this.getBuildings();
    this.cd.detectChanges();
  }
}
