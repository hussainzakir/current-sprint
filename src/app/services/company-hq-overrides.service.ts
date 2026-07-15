import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class CompanyHqOverridesService {
  serverConfig: any = {};
  _host: string;
  httpOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Headers":
        "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Content-type": "application/json",
    }),
  };
  empId: any;
  loggedInCompanyCode: any;
  
  constructor(
    public http: HttpClient,
    commonService: CommonService,
    cookieService: CookieService
  ) {
    this.http = http;
    const me = this;
    me._host = commonService.getBSSHost();
  }
  getCompanyHqOverrideDetail(
    loggedInCompanyCode,
    loggedinEmpId,
    companyCode,
    quarter
  ) {
    let apiResource='/company-hq-overrides' ;
    if(companyCode!=null && quarter!=null){
      apiResource= '/company-hq-overrides' +"?companyCode=" +
      companyCode+"&quarter=" + quarter
    }
    if(companyCode==null && quarter!=null){
      apiResource= '/company-hq-overrides' + '?quarter=' + quarter
    }
    if(companyCode!=null && quarter==null){
      apiResource= '/company-hq-overrides'+"?companyCode=" +
      companyCode
    }
    return this.http.get<any>(
      this._host +
        loggedInCompanyCode +
        "/" +
        loggedinEmpId +
        apiResource,
      { responseType: "json" }
    );
  }
  createCompanyHqOverrideDetail(
    loggedInCompanyCode,
    loggedinEmpId,
    hqOverride
  ) {
    let apiResource= '/company-hq-overrides' ;
    return this.http.post<any>(
      this._host +
        loggedInCompanyCode +
        "/" +
        loggedinEmpId +
        apiResource,
      hqOverride,

      { responseType: "json" }
    );
  }
  deleteHq(loggedInCompanyCode, loggedinEmpId, companyCode, realmId) {
    let apiResource= '/company-hq-overrides/' ;
    return this.http.delete<any>(
      this._host +
        loggedInCompanyCode +
        "/" +
        loggedinEmpId +
        apiResource +
        companyCode +
        "/" +
        realmId,

      { responseType: "json" }
    );
  }
  getCompanyData(loggedInCompanyCode,loggedinEmpId,companyCode:string)  {
    let apiResource= '/company-hq-overrides/' ;
    return this.http.get<any>(this._host + loggedInCompanyCode+'/'+loggedinEmpId + apiResource +companyCode , {responseType: 'json'});
 }
}
