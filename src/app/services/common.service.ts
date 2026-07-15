import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { AppStringConstants } from '../constants/AppStringConstants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  _cookieService: CookieService;
  constructor(public http: HttpClient, _cookieService: CookieService) {
    this._cookieService = _cookieService;
   }

  getHost() {
    return environment.apiBaseUrl;
  }
  getBSSHost(){
    return environment.apiBSSBaseUrl;
  }
  getCurrentHostName(): string {
    return document.location.hostname;
  }

   loadSession():Promise<any> {
    let url = `/api-trinet-auth/services/v1.0/authentication/user/token-details?realm=sw_hrp`;
    return new Promise((resolve, reject) => {

    this.http.get(url).subscribe((res: any) => {
      
      this.saveSession({
        employeeId: res.emplid && res.emplid[0],
        companyId: res.companyid && this.getCurrentCompanyId(res.companyid),
      });
      resolve(true);
    }, (err) => {
      reject(err);
    });
  });
  }

  saveSession(data: any): void {
    sessionStorage.setItem('loggedIncompanyId', data.companyId);
    sessionStorage.setItem('loggedInemployeeId', data.employeeId);
  }

  getCurrentCompanyId(companyIds: string[]): string {
    let companyId = companyIds[0];
    let currentCompanyIdCookieValue = this._cookieService.getAll()[
      'CurrentCompanyId'
    ];

    if (currentCompanyIdCookieValue && companyIds.indexOf(currentCompanyIdCookieValue) > -1) {
      companyId = currentCompanyIdCookieValue;
    }
    return companyId;
  }

  getCompanyId(): string {
    return sessionStorage.getItem('loggedIncompanyId');
  }

  getEmployeeId(): string {
    return sessionStorage.getItem('loggedInemployeeId');
  }
}
