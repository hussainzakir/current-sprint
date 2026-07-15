import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieModule, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { PlanComparsionTestData } from '../testing/test-data-plan-comparsion';
import { CommonService } from './common.service';
import { PlanAttributesService } from './plan-attributes.service';

describe('PlanAttributesService', () => {
  let service: PlanAttributesService;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let commonService: CommonService;
  let cookieServiceSpy: any;
  let loggedinEmpId: string;
  let loggedInCompanyCode: string;
  let mockData = JSON.stringify(PlanComparsionTestData.COMPANY_NAME_RESPONSE);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClient,
        HttpClientTestingModule,
        AppModule,
        CookieModule.forRoot()
      ],
      providers: [PlanAttributesService, CookieService, CookieOptionsProvider]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    cookieServiceSpy = jasmine.createSpyObj("CookieService", ['set', 'get']);
    commonService = new CommonService(<any>httpClientSpy, cookieServiceSpy);
    service = new PlanAttributesService(<any>httpClientSpy, commonService);
    loggedinEmpId = "00001940564";
    loggedInCompanyCode = "001"
  });

  it('getCompanyName() should return expected company name', () => {
    const expectedData = JSON.parse(mockData);
    const companycode = '15K8';
    httpClientSpy.get.and.returnValue(of(expectedData));
    service.getCompanyName(companycode, loggedInCompanyCode).subscribe(
      actualData => expect(actualData).toEqual(expectedData)
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('getAllPlans() should return expected result', () => {
    const mockData = JSON.stringify(PlanComparsionTestData.CURRENT_YEAR_OR_ALL_PLANS);
    const paramData = {
      loggedInCompanyCode: loggedInCompanyCode,
      loggedinEmpId: loggedinEmpId,
      companyCode: 'Q8S'
    }
    httpClientSpy.get.and.returnValue(of(JSON.parse(mockData)));
    service.getAllPlans(paramData).subscribe(data => {
      expect(Object.keys(data).length).toBe(3);
      expect(data.mappedPlans).toEqual(JSON.parse(mockData));
    });
    expect(httpClientSpy.get.calls.count()).toBe(3);
  });

  it('getPlanLimitCount() should return expected result', () => {
    const mockPlans = {PLAN_COMPARE_LIMIT_COUNT:'50'};
    const paramData = {
      loggedInCompanyCode: loggedInCompanyCode,
      loggedinEmpId: loggedinEmpId,
      companyCode: 'Q8S'
    }
    httpClientSpy.get.and.returnValue(of(mockPlans));
    service.getPlanLimitCount(paramData).subscribe(data => {
      expect(data.PLAN_COMPARE_LIMIT_COUNT).toEqual('50');
    });
  });

  it('exportAsExcel API, call', () => {
    const paramData = {
      loggedInCompanyCode: loggedInCompanyCode,
      loggedinEmpId: loggedinEmpId,
      companyCode: 'Q8S'
    };
    httpClientSpy.post.and.returnValue(of(new HttpResponse()));
    service.exportAsExcel(paramData, []).subscribe(data => {
      expect(data).toEqual(new HttpResponse());
    });
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

});
