import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieModule, CookieService, CookieOptionsProvider } from 'ngx-cookie';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { CommonService } from './common.service';
import { PreloadStrategiesService } from './preload-strategies.service';

describe('PreloadStrategiesService', () => {
  let service: PreloadStrategiesService;
  let servicePost: PreloadStrategiesService;

  let httpClientSpy: { get: jasmine.Spy };
  let httpPostClientSpy: { post: jasmine.Spy };
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
      providers: [PreloadStrategiesService, CookieService, CookieOptionsProvider
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpTestingController = TestBed.inject(HttpTestingController);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post']);
    httpPostClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    cookieServiceSpy = jasmine.createSpyObj("CookieService", ['set', 'get']);
    commonService = new CommonService(<any>httpClientSpy, cookieServiceSpy);
    service = new PreloadStrategiesService(<any>httpClientSpy, commonService, cookieServiceSpy);
    servicePost = new PreloadStrategiesService(<any>httpPostClientSpy, commonService, cookieServiceSpy);

    loggedinEmpId = "00001940564";
    loggedInCompanyCode = "001"

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be PreloadStrategiesService', () => {
    
    let expectedGuaterList: any = [];
    service = new PreloadStrategiesService(<any>httpPostClientSpy, commonService, cookieServiceSpy);

    //mock
    httpPostClientSpy.post.and.returnValue(of(expectedGuaterList));
    servicePost.preloadStrategiesByCompanyCode(loggedinEmpId,loggedInCompanyCode,["001"]).subscribe(data=>{
      expect(data).toEqual([]);
    })

    servicePost.preloadStrategiesByQuater(loggedinEmpId,loggedInCompanyCode,'oe/q4').subscribe(data=>{
      expect(data).toEqual([]);
    })
       
        
  });

  it('getAllQuater() should return expected exceptions (HttpClient called once)', () => {
    //given

    let expectedGuaterList: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(expectedGuaterList));

    //when
    service.getAllQuater(loggedInCompanyCode, loggedinEmpId).subscribe(
      actualData => expect(actualData).toEqual(expectedGuaterList, 'expected exceptions')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/quarters-info')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });

  it('getAllPreloadStrategiesStatus() should return expected exceptions (HttpClient called once)', () => {
    //given

    let expectedGuaterList: any = [];

    //mock
    httpClientSpy.get.and.returnValue(of(expectedGuaterList));

    //when
    service.getAllPreloadStrategiesStatus(loggedInCompanyCode, loggedinEmpId).subscribe(
      actualData => expect(actualData).toEqual(expectedGuaterList, 'expected exceptions')
    );

    //then
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    let args = httpClientSpy.get.calls.allArgs()[0];
    expect(args.length).toEqual(2);
    let endpoint: String = args[0];
    expect(endpoint.endsWith('/pre-load-strategies-status')).toBeTruthy();
    expect(args[1].responseType).toEqual("json");
  });
 
});
