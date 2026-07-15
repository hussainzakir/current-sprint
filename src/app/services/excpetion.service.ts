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
import { LifeDisabilityOverride } from '../models/LifeDisabilityOverride';

const localhost = AppStringConstants.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class ExcpetionService {

  serverConfig: any = {};
  _host: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
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
  getAllExchanges(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/product-quarters/" + "001", { responseType: 'json' });
  }
  getAllExceptions(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/minfund-exceptions/" + "001", { responseType: 'json' });
  }

  getDeSelectionExceptions(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/plan-deselection-exceptions/" + "001", { responseType: 'json' });
  }

  getAllCompanies(loggedInCompanyCode, loggedinEmpId, companyCode) {
    if (companyCode && companyCode !== null)
      return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/company-name/" + companyCode.toUpperCase(), { responseType: 'json' });
  }
  editException(loggedInCompanyCode, loggedinEmpId, exception: Exception): Observable<Exception> {
    return this.http.put<Exception>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/minfund-exceptions/" + "001", exception, this.httpOptions)
  }
  editDeselectionException(loggedInCompanyCode, loggedinEmpId, exception: Exception): Observable<Exception> {
    return this.http.put<Exception>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/plan-deselection-exceptions/" + "001", exception, this.httpOptions)
  }
  createException(loggedInCompanyCode, loggedinEmpId, exception: Exception): Observable<Exception> {
    return this.http.post<Exception>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/minfund-exceptions/" + "001", exception, this.httpOptions)
  }
  createDeselectionException(loggedInCompanyCode, loggedinEmpId, exception: Exception): Observable<Exception> {
    return this.http.post<Exception>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/plan-deselection-exceptions/" + "001", exception, this.httpOptions)
  }
  getException(loggedInCompanyCode, loggedinEmpId, id) {
    if (id && id !== null)
      return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/minfund-exceptions/" + id + "/" + "001", { responseType: 'json' });
  }

  getDeselectionException(loggedInCompanyCode, loggedinEmpId, id) {
    if (id && id !== null)
      return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/plan-deselection-exceptions/" + id + "/" + "001", { responseType: 'json' });
  }

  //Attributes like Plan Types and Approvers for different exceptions 
  getExceptionAttributes(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/exceptionAttributes/" + "001", { responseType: 'json' });

  }

  //BenofferType Exception API calls
  getAllBenOfferExceptions(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/benoffer-exceptions/" + "001", { responseType: 'json' });
  }
  createBenOfferException(loggedInCompanyCode, loggedinEmpId, benOfferException: BenOfferException): Observable<BenOfferException> {
    return this.http.post<BenOfferException>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/benoffer-exceptions/" + "001", benOfferException, this.httpOptions)
  }
  editBenOfferException(loggedInCompanyCode, loggedinEmpId, benOfferException: BenOfferException): Observable<BenOfferException> {
    return this.http.put<BenOfferException>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/benoffer-exceptions/" + "001", benOfferException, this.httpOptions)
  }
  getBenOfferException(loggedInCompanyCode, loggedinEmpId, id) {
    if (id && id !== null)
      return this.http.get<any>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/benoffer-exceptions/" + id + "/" + "001", { responseType: 'json' });
  }
  //LifeDisabilityOverride Exception API calls
  getAllLifeAndDisabilityOverrideExceptions(loggedInCompanyCode, loggedinEmpId) {
    return this.http.get<LifeDisabilityOverride[]>(this._host + loggedInCompanyCode + '/' + loggedinEmpId + "/life-disability-band-exceptions/" + "001", { responseType: 'json' });
  }
}

