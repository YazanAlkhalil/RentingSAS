import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../models/_User';
import Parse from 'parse';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { Report } from '../../models/Report';
import { Apartment } from '../../models/Interfaces/Apartment';
import { ReportService } from '../../services/dataServices/report.service';
@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    standalone: true,
    imports: [CommonModule,TableModule,ButtonModule,FormsModule ,AvatarModule,InputTextModule],
    providers: [ReportService],
    styles: [
    `
    :host ::ng-deep {
        .p-paginator {
            .p-paginator-current {
                margin-left: auto;
            }
        }
        
        .p-progressbar {
            height: .5rem;
            background-color: #D8DADC;
        
            .p-progressbar-value {
                background-color: #607D8B;
            }
        }
        
        .table-header {
            display: flex;
            justify-content: space-between;
        }
        
        .p-calendar .p-datepicker {
            min-width: 25rem;
        
            td {
                font-weight: 400;
            }
        }
        
        .p-datatable.p-datatable-customers {
            .p-datatable-header {
                padding: 1rem;
                text-align: left;
                font-size: 1.5rem;
            }
        
            .p-paginator {
                padding: 1rem;
            }
        
            .p-datatable-thead > tr > th {
                text-align: left;
            }
        
            .p-datatable-tbody > tr > td {
                cursor: auto;
            }
        
            .p-dropdown-label:not(.p-placeholder) {
                text-transform: uppercase;
            }
        }
    
        .p-w-100 {
            width: 100%;
        }
        
        /* Responsive */
        .p-datatable-customers .p-datatable-tbody > tr > td .p-column-title {
            display: none;
        }
    }
    
    @media screen and (max-width: 960px) {
        :host ::ng-deep {
            .p-datatable {
                &.p-datatable-customers {
                    .p-datatable-thead > tr > th,
                    .p-datatable-tfoot > tr > td {
                        display: none !important;
                    }
        
                    .p-datatable-tbody > tr {
                        border-bottom: 1px solid var(--layer-2);
        
                        > td {
                            text-align: left;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            border: 0 none;
        
                            .p-column-title {
                                min-width: 30%;
                                display: inline-block;
                                font-weight: bold;
                            }
            
                            p-progressbar {
                                width: 100%;
                            }
    
                            &:last-child {
                                border-bottom: 1px solid var(--surface-d);
                            }
                        }
                    }
                }
            }
        } 
    }   
    `
    ],
})
export class ReportsComponent implements OnInit {
    reports!: any[];
    loading: boolean = true;

    constructor(private cd: ChangeDetectorRef,private reportService:ReportService) {}

    ngOnInit() {
        if (!this.reports) {
            console.log(this.reportService.fetchReports());
            
            this.reportService.fetchReports().then((reports)=>{
                this.reports = reports
                console.log(this.reports,'ee');
                
                this.cd.detectChanges()
            });
        }
    }
   
    // Remove unused methods
}