import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Client } from '../../models/Client'
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
import { ClientService } from '../../services/dataServices/client.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { ImageCropperDialogComponent } from '../buildings/image-cropper-dialog/image-cropper-dialog.component';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule
    ,AvatarModule,PaginatorModule,ProgressSpinnerModule
  ],
  templateUrl: './clients.component.html',
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ],
  providers: [MessageService, ConfirmationService,DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent {
  clientDialog: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef;
  searchSubscription!: Subscription;
  clients!: Client[];

  client!: Client;

  selectedClients: Client[] =[];

  submitted: boolean = false;
  dataImage: string | null = null;
  data : {
    searchValue: string,
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortOrder: number,
    withCount: boolean
  } = {
    searchValue: '',
    pageIndex: 0,
    pageSize: 10,
    sortField: 'createdAt',
    sortOrder: 1,
    withCount: true
  }
  count: number = 0;
  loading: boolean = true;


  private imageCropperDialogComponentRef: DynamicDialogRef | undefined;

  constructor(private cd:ChangeDetectorRef,private messageService: MessageService, private confirmationService: ConfirmationService,
    private clientService: ClientService,
    private imageCompress: NgxImageCompressService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getClients()
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
        this.getClients();
      });
  }

  onSort(event: any) {
    this.data.sortField = event.field;
    this.data.sortOrder = event.order;
    this.getClients();
  }

  onPageChange(event: any) {
    this.data.pageIndex = event.first;
    this.data.pageSize = event.rows;
    this.getClients();
  }

  removeProfilePic() {
    this.client.unset("img");
    this.dataImage = "";
    this.cd.detectChanges();
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
          this.client.img = img;
          this.dataImage = "data:image/jpeg;base64," + img._data;
          this.cd.detectChanges();
        }
      });
    });
    this.dataImage = null;
    this.cd.detectChanges();
  }


  getClients(){
    this.loading = true;
    this.cd.detectChanges()
    this.clientService.getClients(this.data).then((data: { results: Client[], count: number } | any) => {
      this.clients = data?.results
      this.count = data?.count
      this.loading = false;
      this.cd.detectChanges()
    });
  }
  openNew() {
    this.client = new Client()
    this.submitted = false;
    this.clientDialog = true;
  }

  deleteSelectedClients() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteSelectedClients(this.selectedClients).then((data)=>{ 
          this.clients = this.clients.filter((val) => !this.selectedClients?.includes(val));
          this.selectedClients = [];
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
        })
      }
    });
  }

  editClient(client: Client) {
    this.client = client
    this.clientDialog = true;
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + client.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteClient(client).then((data)=>{
          this.clients = this.clients.filter((val) => val.id !== client.id);
          this.client = new Client();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
        })
      }
    });
  }

  hideDialog() {
    this.clientDialog = false;
    this.submitted = false;
  }

  saveClient() {
    this.submitted = true;
    if (this.client?.name?.trim()) {
      if (this.client.id) {
        this.clientService.updateClient(this.client).then(()=>{
          this.getClients()
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
        })
      } else {
        this.clientService.createClient(this.client).then(()=>{
          this.getClients()
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
        })
      }

      this.clients = [...this.clients];
      this.clientDialog = false;
      this.client = new Client();
    }
  }
  
}
