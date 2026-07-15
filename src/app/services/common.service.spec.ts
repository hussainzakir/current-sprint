import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../app.module';
import { of, throwError } from 'rxjs';
import { CookieModule, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { asyncData } from '../testing/async-observable-helpers';

describe('CommonService', () => {
  let service: CommonService;
  let httpClientSpy: { get: jasmine.Spy };
  let cookieServiceMock: jasmine.SpyObj<CookieService>;
  
  beforeEach(() => {

    cookieServiceMock = jasmine.createSpyObj<CookieService>('CookieService', ['hasKey','get', 'getObject', 'getAll','put','putObject','remove','removeAll']);

    TestBed.configureTestingModule({
      imports: [
        HttpClient,
        HttpClientTestingModule,
        AppModule,
        CookieModule.forRoot()
      ],
      providers: [CommonService,{
        provide: CookieService,
        useValue: cookieServiceMock
    }, CookieOptionsProvider]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    //service = TestBed.inject(CommonService);
    service = new CommonService(<any> httpClientSpy, cookieServiceMock)
    httpClientSpy.get = jasmine.createSpy('get').and.callFake(
      () => asyncData({emplid:[],companyid:12})
    );
    //httpTestingController = TestBed.get(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).not.toBeNull();
  });
 
  it('get host() should return environment.apiBaseUrl', () => {
    environment.production = true;
    expect(service.getHost()).toEqual(environment.apiBaseUrl);
  });

  xit('get host() should return environment.apiBaseUrl', () => {
    environment.production = false;
    expect(service.getHost()).toEqual('http://'+ window.location.hostname + environment.apiBaseUrl);
  });

  it('get BSS host() should return environment.apiBaseUrl', () => {
    environment.production = true;
    expect(service.getBSSHost()).toEqual(environment.apiBSSBaseUrl);
  });

  xit('get BSS host() should return environment.apiBaseUrl', () => {
    environment.production = false;
    expect(service.getBSSHost()).toEqual('http://'+ window.location.hostname +environment.apiBSSBaseUrl);
  });

  it('getCompanyId() should return G48', () => {
    sessionStorage.setItem('loggedIncompanyId', 'G48');
    expect(service.getCompanyId()).toEqual('G48');
  });

  it('getEmployeeId() should return 000019567893', () => {
    sessionStorage.setItem('loggedInemployeeId', '000019567893');
    expect(service.getEmployeeId()).toEqual('000019567893');
  });

  it('get getCurrentHostName() should return environment.apiBaseUrl', () => {
    expect(service.getCurrentHostName()).toEqual(window.location.hostname);
  });
  
  it('saveSession()', () => {
    let data:any= {
      employeeId: '000019567893',
      companyId: 'G48',
    }
    service.saveSession(data);
    expect(service.getEmployeeId()).toEqual('000019567893');
    expect(service.getCompanyId()).toEqual('G48');
  });

  it('getCurrentCompanyId() - no cookie available', () => {
    let companyIds = ['G48'];
    cookieServiceMock.getAll.and.returnValue({'CurrentCompanyId': 'G48'});
    expect(service.getCurrentCompanyId(companyIds)).toEqual('G48');
  });
  it('getCurrentCompanyId() -  cookie available', () => {
    let companyIds = ['G48','L1M'];
    let currentCompanyId = 'L1M';
    cookieServiceMock.getAll.and.returnValue({'CurrentCompanyId': 'G48'});
    expect(service.getCurrentCompanyId(companyIds)).toEqual('G48');
    expect(service.getCurrentCompanyId(companyIds)).toEqual(companyIds[0]);
  });
  it("should test loadSession", (done) => {
    cookieServiceMock.getAll.and.returnValue({'CurrentCompanyId': 'G48'});
    httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of({emplid:[123, 456],companyid:["G48"]}));
    service.loadSession().then((res) => {
      expect(res).toBe(true);
      done();
    });
    expect(service.loadSession).toBeDefined();
  });
  it("should test error case for loadSession ", () => {
    httpClientSpy.get = jasmine.createSpy('get').and.returnValue(throwError(false));
    //tick();
    service.loadSession().then((res) => {
      expect(res).toBe(true);
    }, (err) => {
      expect(err).toBe(false);
    });
    expect(service.loadSession).toBeDefined();
  });
});
