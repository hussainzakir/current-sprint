import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonService } from './common.service';
import { Exception } from '../models/exception';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { Observable } from 'rxjs';
import { BenOfferException } from '../models/benOfferException';
import { map } from 'rxjs/internal/operators/map';
import { CookieService } from 'ngx-cookie';
import { AppStringConstants } from '../constants/AppStringConstants';

const localhost = AppStringConstants.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class PreloadStrategiesService {

  serverConfig: any = {};
  _host: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization,append,delete,entries,foreach,get,has,keys,set,values,Authorization',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Content-type': 'application/json'
    })
  };
  empId: any;
  loggedInCompanyCode: any;
  constructor(public http: HttpClient, commonService: CommonService, cookieService: CookieService) {
    this.http = http;
    const me = this;
    me._host = commonService.getBSSHost();
  }
  getAllQuater(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/quarters-info", { responseType: 'json' });

  }
  getAllPreloadStrategiesStatus(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/pre-load-strategies-status", { responseType: 'json' });
  }

  preloadStrategiesByCompanyCode(loggedInCompanyCode, loggedinEmpId, listOfCompanyCodes: string[]): Observable<any> {
    return this.http.post<Exception>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/pre-load-strategies-companies" , listOfCompanyCodes, this.httpOptions)

  }
  preloadStrategiesByQuater(loggedInCompanyCode, loggedinEmpId, quater: string): Observable<any> {
    return this.http.post<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/pre-load-strategies/" + quater, this.httpOptions)

  }

}

