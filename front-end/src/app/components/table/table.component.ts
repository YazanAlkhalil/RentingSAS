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
import { PaginatorModule } from 'primeng/paginator';
import { Company } from '../../models/Company';
import { AdminService } from '../../services/dataServices/admin.service';
import { ImageModule } from 'primeng/image';
import Parse from 'parse';
import { ParseError } from '@angular/compiler';
import { User } from '../../models/_User';
import { AvatarModule } from 'primeng/avatar';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, ImageModule, AvatarModule, PaginatorModule],
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
  userDialog: boolean = false;
  users: Parse.User[] = [];
  selectedCompany!: Company;
  addUserDialog: boolean = false;
  newUser: User = new User();
  skip: number = 0;
  limit: number = 10;
  count: number = 0;
  searchValue: string = '';
  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  onPageChange(event: any) {
    this.skip = event.first;
    this.limit = event.rows;
    this.getCompanies();
  }

  ngOnInit() {
    this.getCompanies();
  }

  onSearchChange() {
    this.skip = 0; 
    this.getCompanies();
  }

  onSort(event: SortEvent) {
    this.sortField = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';
    this.getCompanies();
  }

  getCompanies() {
    this.adminService.getCompanies({
      searchValue: this.searchValue,
      withCount: true,
      skip: this.skip,
      limit: this.limit,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    }).then((data: Company[] | { results: Company[]; count: number }) => {
      if ('results' in data) {
        this.companies = data.results;
        this.count = data.count;
      }
      else{
        this.companies = data;
      }
      console.log(data);
            
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
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
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
    this.company = company;
    this.companyDialog = true;
  }

  deleteCompany(company: Company) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + company.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
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
    this.company.revert()  
    this.companyDialog = false;
    this.submitted = false;
  }

  async saveCompany() {
    this.submitted = true;
    
    if (this.company.name?.trim()) {
      if (this.company.id) {
        // Update existing company
        this.companies[this.findIndexById(this.company.id)] = this.company;
        await this.company.save()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
      } else {
        try {
          // Create new company
          await this.adminService.addCompany({
            name: this.company.name,
            address: this.company.address,
            contactInfo: this.company.contactInfo,
            img: this.company.img,
            skip: 0,
            limit: 10
          }).then(company => {
            this.companies.unshift(company);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
          });
        } catch (error: ParseError | any) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        }
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
    const parseFile = new Parse.File(file.name, file);
    this.company.img = parseFile;
    
  }

  manageUsers(company: Company) {
    this.selectedCompany = company;
    this.getUsers();
    this.userDialog = true;
  }

  getUsers() {
    this.cd.detectChanges();
    this.adminService.getUsersByCompany(this.selectedCompany.toPointer())
      .then(users => {
        this.users = users;
        console.log(this.users);
        
        this.cd.detectChanges();
      });
  }

  

  openAddUserDialog() {
    this.newUser = new User();
    console.log(this.newUser);
    
    this.addUserDialog = true;
  }

  hideAddUserDialog() {
    this.newUser.revert()
    this.addUserDialog = false;    
    this.cd.detectChanges()
  }

  async saveUser() {
    if(this.newUser.id){
      try {
        await this.newUser.save()
        this.getUsers()
        this.cd.detectChanges()
        this.addUserDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
      } catch (error: ParseError | any) {
        console.error('Error updating user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      }
      return
    }
    const company = new Company()
    company.id = this.selectedCompany.id
    this.newUser.set('company', company);
    console.log(this.newUser);
    
    this.adminService.addUser(this.newUser)
      .then(user => {
        this.getUsers()       
        this.cd.detectChanges();
        this.addUserDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Added', life: 3000 });
      })
      .catch(error => {
        console.error('Error adding user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      });
  }

  editUser(user: User) {
    this.newUser.set('username', user.attributes["username"])
    this.newUser.set('password', user.attributes["password"])
    this.newUser.set('contactInfo', user.attributes["contactInfo"])
    this.newUser.set('img', user.attributes["img"])
    this.newUser.id = user.id
    // this.newUser = user;
    console.log(this.newUser);
    
    this.addUserDialog = true;
  }

  deleteUser(user: User) {

    this.adminService.deleteUser(user)
      .then(() => {
        this.getUsers();
      });
  }

  onUserImageUpload(event: any) {
    const file = event.files[0];
    const parseFile = new Parse.File(file.name, file);
    this.newUser.img = parseFile;
  }
}
