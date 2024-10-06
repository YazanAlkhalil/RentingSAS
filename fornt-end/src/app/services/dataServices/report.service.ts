import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Report } from '../../models/Report';
import { Apartment } from '../../models/Apartment';
import Parse from 'parse';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private cd: ChangeDetectorRef) { }
  reports: Report[] = [];
  loading = false;
  
  async fetchReports() :Promise<any[]> {
    const company_id = Parse.User.current()?.attributes["company"];
    if (!company_id) return [];
    const query = new Parse.Query(Report);
    query.equalTo('company_name', company_id);
    query.include('building_name');
    query.include('user_name');
    const reports = await query.find()
    if(reports.length > 0){

      this.reports = reports;
      this.reports.forEach(report => {
          report.set('apartment_name', report.get('building_name').attributes.apartment.find((apartment: Apartment) => apartment.id === report.get('apartment_name')));
      });
    }
    this.loading = false;
    this.cd.detectChanges();
    return this.reports
    
    
}
}
