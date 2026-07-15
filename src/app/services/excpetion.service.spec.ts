import { TestBed } from '@angular/core/testing';

import { ExcpetionService } from './excpetion.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '../../../node_modules/@angular/common/http/testing';
import { AppModule } from '../app.module';
import { of } from 'rxjs';
import { CommonService } from './common.service';
import { Exception } from '../models/exception';
import { TestData } from '../testing/test-data';
import { CookieModule, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { BenOfferException } from '../models/benOfferException';

describe('ExcpetionService', () => {
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  let service: ExcpetionService;
  let commonService: CommonService;
  let cookieServiceSpy:any;
  let loggedinEmpId: string;
  let loggedInCompanyCode: string;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClient,
        HttpClientTestingModule,
        AppModule,
        CookieModule.forRoot()
      ],
      providers: [ExcpetionService,CookieService, CookieOptionsProvider]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post','put']);
    cookieServiceSpy = jasmine.createSpyObj("CookieService", ['set', 'get']);
    commonService = new CommonService(<any> httpClientSpy,cookieServiceSpy);
    service = new ExcpetionService(<any> httpClientSpy, commonService,cookieServiceSpy);
    loggedinEmpId = "00001940564";
    loggedInCompanyCode = "001"
  });

  it('should be created', () => {
    expect(service).not.toBeNull();
  });
  it('getAllExcepions() should return expected exceptions (HttpClient called once)', () => {
    //given
    
    let expectedExceptions: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(expectedExceptions));

    //when
    service.getAllExceptions(loggedInCompanyCode,loggedinEmpId).subscribe(
      actualData => expect(actualData).toEqual(expectedExceptions, 'expected exceptions')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/minfund-exceptions/' + '001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });

  it('getAllExchanges() should return expected exchanges (HttpClient called once)', () => {
    //given
    
    let exchanges: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(exchanges));

    //when
    service.getAllExchanges(loggedInCompanyCode,loggedinEmpId).subscribe(
      actualData => expect(actualData).toEqual(exchanges, 'expected exchanges')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/product-quarters/' + '001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });
  

  it('getExceptionAttributes() should return expected exceptionAttributes (HttpClient called once)', () => {
    //given
    
    let exceptionAttributes: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(exceptionAttributes));

    //when
    service.getExceptionAttributes(loggedInCompanyCode,loggedinEmpId).subscribe(
      actualData => expect(actualData).toEqual(exceptionAttributes, 'expected exceptionAttributes')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/exceptionAttributes/' + '001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });

   it('getAllCompanies() should return expected Companies (HttpClient called once)', () => {
  //   //given
     const companyId: string = 'G48';
     let companies: any = [];

  //   //mock
     httpClientSpy.get.and.returnValue(of(companies));

  //   //when
     service.getAllCompanies(loggedInCompanyCode,loggedinEmpId,companyId).subscribe(
       actualData => expect(actualData).toEqual(companies, 'expected companies')
     );

    //then
     expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
     expect(args.length).toEqual(2);
     let endpoint: String = args[0];
     expect(endpoint.endsWith('/company-name/' + companyId)).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
   });

  it('createException()  (On create exception - with an exception object)', () => {
    //given
    const exception: Exception = new Exception();
    let createdException: Exception = TestData.exceptions[0];

    //mock
    // httpClientSpy.post(exception).and.returnValue(of(createdException));
    httpClientSpy.post.and.returnValue(of(TestData.exceptions[0]));

    //when
    service.createException(loggedInCompanyCode,loggedinEmpId,createdException).subscribe(
      actualData => expect(actualData).toEqual(createdException, 'expected exception')
    );

    //then
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.post.calls.allArgs()[0];
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/minfund-exceptions/001')).toBeTruthy();
    expect(args.length).toEqual(3);
  });

  it('createBenOfferException() (On create benefit offer exception - with an benefit offer exception)',()=>{
    //given
    let createdBenefitOfferException: BenOfferException = TestData.exceptions[0];

    //mock
    httpClientSpy.post.and.returnValue(of(TestData.exceptions[0]));

    //when
    service.createBenOfferException(loggedInCompanyCode,loggedinEmpId,createdBenefitOfferException).subscribe(
      actualData => expect(actualData).toEqual(createdBenefitOfferException, 'expected exception')
    );

    //then
    expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.post.calls.allArgs()[0];
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/benoffer-exceptions/001')).toBeTruthy();
    expect(args.length).toEqual(3);
  });

  it('editException()  (HttpClient called once)', () => {
    //given
    const exception: Exception = new Exception();
    let editedException: Exception ;

    //mock
    httpClientSpy.put.and.returnValue(of(editedException));

    //when
    service.editException(loggedInCompanyCode, loggedinEmpId, exception).subscribe(
      actualData => expect(actualData).toEqual(editedException, 'expected exception')
    );

    //then
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.put.calls.allArgs()[0];
    expect(args.length).toEqual(3);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/minfund-exceptions/001')).toBeTruthy();
  });

  it('editBenOfferException() (HttpClient called once',()=>{
    //given
    let editedBenOfferException: BenOfferException;

    //mock
    httpClientSpy.put.and.returnValue(of(editedBenOfferException));

    //when
    service.editBenOfferException(loggedInCompanyCode, loggedinEmpId, editedBenOfferException).subscribe(
      actualData => expect(actualData).toEqual(editedBenOfferException, 'expected exception')
    );

    //then
    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.put.calls.allArgs()[0];
    expect(args.length).toEqual(3);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/benoffer-exceptions/001')).toBeTruthy();
  });

  it('getException()  (HttpClient called once)', () => {
    //given
    let refreshedException: Exception ;
    const exceptionId: number = 1;

    //mock
    httpClientSpy.get.and.returnValue(of(refreshedException));

    //when
    service.getException(loggedInCompanyCode,loggedinEmpId,exceptionId).subscribe(
      actualData => expect(actualData).toEqual(refreshedException, 'expected exception')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/minfund-exceptions/' + exceptionId + '/001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });
  
  it('getAllBenOfferExceptions() should return expected exceptions (HttpClient called once)', () => {
    //given
    
    let planTypeExceptions: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(planTypeExceptions));

    //when
    service.getAllBenOfferExceptions(loggedInCompanyCode,loggedinEmpId).subscribe(
      actualData => expect(actualData).toEqual(planTypeExceptions, 'expected exceptions')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/benoffer-exceptions/' + '001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });
  
  it('getBenOfferException()  (HttpClient called once)', () => {
    //given
    let refreshedException: Exception ;
    const exceptionId: number = 1;

    //mock
    httpClientSpy.get.and.returnValue(of(refreshedException));

    //when
    service.getBenOfferException(loggedInCompanyCode,loggedinEmpId,exceptionId).subscribe(
      actualData => expect(actualData).toEqual(refreshedException, 'expected exception')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/benoffer-exceptions/' + exceptionId + '/001')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });

  // it('getTrinetAuthDetails() should return expected exchanges (HttpClient called once)', () => {​​​​​
  //   //given
  //   let exchanges: any = [];
  //   //mock
  //   httpClientSpy.get.and.returnValue(of(TestData.authDetails));
  //   //when
  //   service.getTrinetAuthDetails().subscribe(
  //   actualData => expect(actualData).toEqual(TestData.authDetails, 'expected Token details')
  //   );
  //   //then
  //   expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  //   }​​​​​);

    it('getAllCompanies() id null should return expected Companies (HttpClient called once)', () => {
      //   //given
         const companyId: string = null;
         let companies: any = [];
  
         service.getAllCompanies(loggedInCompanyCode,loggedinEmpId,companyId);  
        //then
         expect(httpClientSpy.get.calls.count()).toBe(0, 'zero call');
        
       });

       it('getBenOfferException()  (HttpClient called zero null input)', () => {
        //given
        let refreshedException: Exception ;
        const exceptionId: number = null;
        //mock
        httpClientSpy.get.and.returnValue(of(refreshedException));
        //when
        service.getBenOfferException(loggedInCompanyCode,loggedinEmpId,exceptionId);
        //then
        expect(httpClientSpy.get.calls.count()).toBe(0, 'zero call');
       
      });

      it('getException()  (HttpClient called zero null input)', () => {
        //given
        let exception: Exception ;
        const exceptionId: number = null;
        //mock
        httpClientSpy.get.and.returnValue(of(exception));
        //when
        service.getException(loggedInCompanyCode,loggedinEmpId,exceptionId);
        //then
        expect(httpClientSpy.get.calls.count()).toBe(0, 'zero call');
       
      });
});
