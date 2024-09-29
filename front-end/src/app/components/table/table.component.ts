import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { Company } from '../../models/Company';
import { AdminService } from '../../services/dataServices/admin.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, AdminService],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  companyDialog: boolean = false;
  companies: Company[] = [];
  company!: Company;
  selectedCompanies: Company[] = [];
  submitted: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private adminService: AdminService,
    private cd:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.adminService.getCompanies({
      skip: 0,
      limit: 10,
      sortField: 'name',
      searchValue: '',
      withCount: false
    }).then((data: Company[]) => {
      this.companies = data;
      this.cd.detectChanges()
    });
  }

  openNew() {
    this.company = new Company();
    this.submitted = false;
    this.companyDialog = true;
  }

  deleteSelectedCompanies() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected companies?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deletePromises = this.selectedCompanies.map(company => 
          this.adminService.deleteCompany(company)
        );
  
        Promise.allSettled(deletePromises)
          .then(results => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
  
            if (successful > 0) {
              this.getCompanies();
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: `${successful} companies deleted successfully`,
                life: 3000
              });
            }
  
            if (failed > 0) {
              console.error(`Failed to delete ${failed} companies`);
              this.messageService.add({
                severity: 'warn',
                summary: 'Partial Success',
                detail: `Failed to delete ${failed} companies`,
                life: 3000
              });
            }
  
            this.selectedCompanies = [];
            this.cd.detectChanges();
          })
          .catch(error => {
            console.error('Error in batch delete operation:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An unexpected error occurred',
              life: 3000
            });
          });
      }
    });
  }

  editCompany(company: Company) {
    this.company = { ...company } as Company;
    this.companyDialog = true;
  }

  deleteCompany(company: Company) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + company.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.adminService.deleteCompany(company)
          this.getCompanies()
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Deleted', life: 3000 });
        } catch (error) {
          console.error('Error deleting company:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete company',
            life: 3000
          })
        }
        
      }
    });
  }

  hideDialog() {
    this.companyDialog = false;
    this.submitted = false;
  }

  saveCompany() {
    this.submitted = true;

    if (this.company.name?.trim()) {
      if (this.company.id) {
        // Update existing company
        this.companies[this.findIndexById(this.company.id)] = this.company;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
      } else {
        // Create new company
        this.adminService.addCompany({
          name: this.company.name,
          address: this.company.address,
          contactInfo: this.company.contactInfo,
          img: this.company.img,
          skip: 0,
          limit: 10
        }).then(company => {
          this.companies.push(company);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
        });
      }

      this.companies = [...this.companies];
      this.companyDialog = false;
      this.company = new Company();
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.companies.length; i++) {
      if (this.companies[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  getSeverity(status: string) {
    // switch (status) {
    //     case 'INSTOCK':
    //         return 'success';
    //     case 'LOWSTOCK':
    //         return 'warning';
    //     case 'OUTOFSTOCK':
    //         return 'danger';
    // }
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.company.img = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
