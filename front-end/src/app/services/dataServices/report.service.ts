import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Report } from '../../models/Report';
import { Apartment } from '../../models/Interfaces/Apartment';
import Parse from 'parse';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private cd: ChangeDetectorRef) { }
  reports: Report[] = [];
  loading = false;
  
  async fetchReports() :Promise<any[]> {
    const company_id = Parse.User.current()?.attributes["company_id"];
    if (!company_id) return [];
    const query = new Parse.Query(Report);
    query.equalTo('company_id', company_id);
    query.include('building_id');
    query.include('user_id');
    const reports = await query.find()
    if(reports.length > 0){

      this.reports = reports;
      this.reports.forEach(report => {
          report.set('apartment_id', report.get('building_id').attributes.apartment.find((apartment: Apartment) => apartment._id === report.get('apartment_id')));
      });
    }
    this.loading = false;
    this.cd.detectChanges();
    return this.reports
    
    
}
}