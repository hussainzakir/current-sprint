import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PlanAttributesService {

  serverConfig: any = {};
  _host: string;
  empId: any;
  loggedInCompanyCode: any;
  constructor(public http: HttpClient, commonService: CommonService) {
    this.http = http;
    const me = this;
    me._host = commonService.getBSSHost();
  }

  getCompanyName(companyCode: string, loggedInCompanyCode) {
    const hostUrl = '/api-benefits/v1/benefit-profile-client';
    return this.http.get<any>(`${hostUrl}/${loggedInCompanyCode}/profile?searchParam=${companyCode}`);
  }

  getAllPlans(paramData: any) {
    const getCurrentYearPlans = `/api-bss/v1.0/benefits/${paramData.loggedInCompanyCode}/${paramData.loggedinEmpId}/current-year-plans/${paramData.companyCode}`;
    const getMappedPlans = `/api-bss/v1.0/benefits/${paramData.loggedInCompanyCode}/${paramData.loggedinEmpId}/future-mapping-plans/${paramData.companyCode}`;
    const getAllFuturePlans = `/api-bss/v1.0/benefits/${paramData.loggedInCompanyCode}/${paramData.loggedinEmpId}/future-year-plans/${paramData.companyCode}`;
    let currentYearPlans = this.http.get(getCurrentYearPlans);
    let mappedPlans = this.http.get(getMappedPlans);
    let futureYearPlans = this.http.get(getAllFuturePlans);
    return forkJoin({
      currentYearPlans: currentYearPlans,
      mappedPlans: mappedPlans,
      futureYearPlans: futureYearPlans
    });
  }

  getPlanLimitCount(paramData: any){
    const getPlanLimit = `/api-bss/v1.0/benefits/${paramData.loggedInCompanyCode}/${paramData.loggedinEmpId}/rules-configs/${paramData.companyCode}`;
    return this.http.get<any>(getPlanLimit);
  }

  exportAsExcel(paramData:any, payload:any){
    const url = `/api-bss/v1.0/benefits/${paramData.loggedInCompanyCode}/${paramData.loggedinEmpId}/plan-compare-export/${paramData.companyCode}`;
    return this.http.post(url,payload,{
      observe: 'response',
      responseType:'blob'
    });
  }

}
