import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieModule, CookieService, CookieOptionsProvider } from 'ngx-cookie';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { HqOverrideTestData } from '../testing/hq-override';
import { CommonService } from './common.service';

import { CompanyHqOverridesService } from './company-hq-overrides.service';
import { PreloadStrategiesService } from './preload-strategies.service';

describe('CompanyHqOverridesService', () => {
  let service: CompanyHqOverridesService;
  let servicePost: CompanyHqOverridesService;

  let httpClientSpy: { get: jasmine.Spy };
  let httpPostClientSpy: { post: jasmine.Spy };
  let httpDeleteClientSpy: { delete: jasmine.Spy };
  let httpMock: HttpTestingController;
  let httpTestingController: HttpTestingController;

  let commonService: CommonService;
  let cookieServiceSpy: any;
  let loggedinEmpId: string;
  let loggedInCompanyCode: string;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        AppModule,
        CookieModule.forRoot()
      ],
      providers: [CompanyHqOverridesService, CookieService, CookieOptionsProvider
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    httpTestingController = TestBed.get(HttpTestingController);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','delete']);
    httpPostClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpDeleteClientSpy = jasmine.createSpyObj('HttpClient', ['delete']);

    cookieServiceSpy = jasmine.createSpyObj("CookieService", ['set', 'get']);
    commonService = new CommonService(<any>httpClientSpy, cookieServiceSpy);
    service = new CompanyHqOverridesService(<any>httpClientSpy, commonService, cookieServiceSpy);
    servicePost = new CompanyHqOverridesService(<any>httpPostClientSpy, commonService, cookieServiceSpy);

    loggedinEmpId = "00001940564";
    loggedInCompanyCode = "001"

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be createCompanyHqOverrideDetail', () => {
    
    let expectedGuaterList: any = [];
    service = new CompanyHqOverridesService(<any>httpPostClientSpy, commonService, cookieServiceSpy);

    //mock
    httpPostClientSpy.post.and.returnValue(of(expectedGuaterList));
    servicePost.createCompanyHqOverrideDetail(loggedinEmpId,loggedInCompanyCode,HqOverrideTestData.hqOverrideData[0]).subscribe(data=>{
      expect(data).toEqual([]);
    })
        
  });
  it('company-hq-overrides() should return expected exceptions (HttpClient called once)', () => {
    //given

    let expectedGuaterList: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(expectedGuaterList));

    //when
    service.getCompanyData(loggedInCompanyCode, loggedinEmpId,'001').subscribe(
      actualData => expect(actualData).toEqual(expectedGuaterList, 'expected CompanyData')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/company-hq-overrides/001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });

  it('getCompanyHqOverrideDetail() should return expected exceptions (HttpClient called once)', () => {
    //given

    let expectedGuaterList: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(expectedGuaterList));

    //when
    service.getCompanyHqOverrideDetail(loggedInCompanyCode, loggedinEmpId,'001','Q1').subscribe(
      actualData => expect(actualData).toEqual(expectedGuaterList, 'expected CompanyData')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/company-hq-overrides?companyCode=001&quarter=Q1')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");

    
    //when
    service.getCompanyHqOverrideDetail(loggedInCompanyCode, loggedinEmpId,null,'Q1').subscribe(
      actualData => expect(actualData).toEqual(expectedGuaterList, 'expected CompanyData')
    );

   
  });
  
});
