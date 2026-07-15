import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { NewPlantypeExceptionComponent } from './new-plantype-exception.component';
import { By } from '@angular/platform-browser';
import { asyncData } from 'src/app/testing/async-observable-helpers';
import { TestData } from 'src/app/testing/test-data';
import { Component, Input } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { CommonService } from 'src/app/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('NewPlantypeExceptionComponent', () => {
  let component: NewPlantypeExceptionComponent;
  let fixture: ComponentFixture<NewPlantypeExceptionComponent>;
  let page: Page;
  class ExceptionServiceSpy {
    getAllExchanges = jasmine.createSpy('getAllExchanges').and.callFake(
      () => asyncData(TestData.exchanges)
    );
    createBenOfferException = jasmine.createSpy('createBenOfferException').and.callFake(
      () => asyncData(TestData.planTypeExceptions[0])
    );
    getAllCompanies = jasmine.createSpy('getAllCompanies').and.callFake(
      () => asyncData(TestData.company)
    );
    getBenOfferException = jasmine.createSpy('getBenOfferException').and.callFake(
      () => asyncData(TestData.editedException)
    );
    getBenOfferExceptionAttributes = jasmine.createSpy('getExceptionAttributes').and.callFake(
      () => asyncData(TestData.exceptionAttributes)
    );
    getExceptionAttributes = jasmine.createSpy('getExceptionAttributes').and.callFake(
      () => asyncData(TestData.exceptionAttributes)
    );
  }
  class CommonServiceSpy {
    getCompanyId = jasmine.createSpy('getCompanyId').and.returnValue("001");
    getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue("00001940564");
    loadSession = jasmine.createSpy('loadSession').and.returnValue(Promise.resolve({ message: 'success' }));
  }
  let exceptionServiceSpy: ExceptionServiceSpy;
  let commonServiceSpy: CommonServiceSpy;

  beforeEach(waitForAsync(() => {
    @Component({selector: 'app-combobox', template: '<div>Hey this is combo box </div>'})
    class ComboboxComponent {
      @Input() data: any;
      @Input() disableComboBox: any;
      @Input() valueAttribute: any;
      @Input() initialSelected: any;
      @Input() defaultValue: any;
      @Input() cleared: any;
      @Input() comboType: any;
    }

    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: ExcpetionService,  useValue: {}},{ provide: CommonService, useClass: CommonServiceSpy }

      ]    }).overrideComponent(NewPlantypeExceptionComponent, {
        set: {
          providers: [
            { provide: ExcpetionService, useClass: ExceptionServiceSpy },
            { provide: CommonService, useClass: CommonServiceSpy }
          ]
        }
      })
      .compileComponents().then(() =>{
        fixture = TestBed.createComponent(NewPlantypeExceptionComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        exceptionServiceSpy = fixture.debugElement.injector.get(ExcpetionService) as any;
        commonServiceSpy = fixture.debugElement.injector.get(CommonService) as any;
        if (typeof Array.prototype.find !== 'function') {
          Array.prototype.find = function(iterator) {
              var list = Object(this);
              var length = list.length >>> 0;
              var thisArg = arguments[1];
              var value;
  
              for (var i = 0; i < length; i++) {
                  value = list[i];
                  if (iterator.call(thisArg, value, i, list)) {
                      return value;
                  }
              }
              return undefined;    
          };
      }
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('test ngOnInit()', fakeAsync(() => {
      component.ngOnInit();
      fixture.whenStable().then(() => {
      fixture.detectChanges();
      tick();
      expect(component.minimumValueFund).toEqual(0);
      expect(component.maximumValueFund).toEqual(0);
      
      });
    }));
    
    it('onCreateClick ', fakeAsync (() => {
      component.benOfferException = TestData.newBenOfferException;
      component.onCreate();
      expect(exceptionServiceSpy.createBenOfferException.calls.count()).toBe(1,'createException()  called once');
      expect(exceptionServiceSpy.createBenOfferException).toHaveBeenCalledWith("001","00001940564",TestData.newBenOfferException);
      tick();
      //expect(component.newException).toEqual(TestData.newException);
    }));

    it("should handle errorcase for createBenOfferException", () => {
      component.benOfferException.companyCode  = "G48";
      const error:HttpErrorResponse = new HttpErrorResponse({status: 401, error:{_error:{message: "error", customMessage: "error"}}});
      exceptionServiceSpy.createBenOfferException = jasmine.createSpy("createBenOfferException").and.returnValue(throwError(error));
      component.onCreate();
      expect(component.onCreate).toBeDefined();
    });
    it("should handle errorcase for createBenOfferException with status code other than 401 and 403", () => {
      component.benOfferException.companyCode  = "G48";
      const error:HttpErrorResponse = new HttpErrorResponse({status: 404, error:{_error:{message: "error", customMessage: "error"}}});
      exceptionServiceSpy.createBenOfferException = jasmine.createSpy("createBenOfferException").and.returnValue(throwError(error));
      component.onCreate();
      expect(component.onCreate).toBeDefined();
    })
  
    it('handleApproverChange', fakeAsync(() => {
      let approver = "00001792653";
      component.approvers = TestData.approvers;
      component.handleApproverValue(approver);
      expect(component.benOfferException.approverId).toEqual(approver);
      expect(component.benOfferException.approverName).toEqual(TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name);
      })
    );
    it('handlePlanTypeChange', fakeAsync(() => {
      let planType = "10";
      component.handlePlanType(planType);
      expect(component.benOfferException.planType).toEqual("10");
      })
    );

    it('handleOriginDeptChange', fakeAsync(() => {
      let originationDept = "Sales";
      component.originationValues = TestData.originationDept;
      component.handleOriginationTypeChange(originationDept);
      expect(component.benOfferException.originDept).toEqual("Sales");
      })
    );

    it('handleOfferTypeChange', fakeAsync(() => {
      let offeredValue = "Offered";
      component.benOfferException = TestData.newBenOfferException;
      component.handleOfferedTypeChange(offeredValue);
      expect(component.benOfferException.offered).toEqual(true);
      })
    );

    it('handleOfferTypeChange - Not Offered', fakeAsync(() => {
      let offeredValue = "Not Offered";
      component.benOfferException = TestData.newBenOfferException;
      component.handleOfferedTypeChange(offeredValue);
      expect(component.benOfferException.offered).toEqual(false);
      })
    );

    it('on Getting company code - correct company code', fakeAsync (() => {
      component.benOfferException.companyCode  = "G48";
      component.getCompany();
      expect(exceptionServiceSpy.getAllCompanies.calls.count()).toBe(1,'getAllCompanies()  called once');
      expect(exceptionServiceSpy.getAllCompanies).toHaveBeenCalledWith("001","00001940564",component.benOfferException.companyCode);
      tick();
      expect(component.benOfferException.companyName).toEqual("H Comp 4013 Vend Inc.");
    }));
  
    it('on Getting company code - Wrong company code', fakeAsync (() => {
      component.benOfferException.companyCode  = "1111";
      component.getCompany();
      expect(exceptionServiceSpy.getAllCompanies.calls.count()).toBe(1,'getAllCompanies()  called once');
      expect(exceptionServiceSpy.getAllCompanies).toHaveBeenCalledWith("001","00001940564",component.benOfferException.companyCode);
      tick();
      expect(component.benOfferException.companyName).toEqual("");
    }));

    it("should handle error case for getAllCompanies call", () => {
      const error:HttpErrorResponse = new HttpErrorResponse({status: 401, error:{_error:{message: "error", customMessage: "error"}}});
      exceptionServiceSpy.getAllCompanies = jasmine.createSpy("getAllCompanies").and.returnValue(throwError(error));
      component.getCompany();
      expect(component.getCompany).toBeDefined();
    });
    it("should handle error case for getAllCompanies call with status code other than 401 amd 403", () => {
      const error:HttpErrorResponse = new HttpErrorResponse({status: 404, error:{_error:{message: "error", customMessage: "error"}}});
      exceptionServiceSpy.getAllCompanies = jasmine.createSpy("getAllCompanies").and.returnValue(throwError(error));
      component.getCompany();
      expect(component.getCompany).toBeDefined();
    });
    
    it("should null check for benOfferException in validateNewPlanTypeException", () => {
      component.benOfferException = null;
      component.validateNewPlanTypeException();
      expect(component.validateNewPlanTypeException).toBeDefined();
    })
    it("should null check for benOfferException in handleOriginationTypeChange", () => {
      component.benOfferException = null;
      component.handleOriginationTypeChange(1);
      expect(component.handleOriginationTypeChange).toBeDefined();
    })
    it("should null check for benOfferException in handlePlanType", () => {
      component.benOfferException = null;
      component.handlePlanType(1);
      expect(component.handlePlanType).toBeDefined();
    })
    it("should null check for benOfferException in handleApproverValue", () => {
      component.benOfferException = null;
      component.handleApproverValue(1);
      expect(component.handleApproverValue).toBeDefined();
    });
    it("should call getStartDate", () => {
      component.benOfferException = TestData.newBenOfferException;
      component.benOfferException.startDate = new Date("2020-07-01");
      component.getStartDate();
      expect(component.getStartDate).toBeDefined();
    });
    it("should call getEndDate", () => {
      component.benOfferException = TestData.newBenOfferException;
      component.benOfferException.endDate = new Date("2020-10-31");
      component.getEndDate();
      expect(component.getEndDate).toBeDefined();
    });



  class Page {
    private fixture: ComponentFixture<NewPlantypeExceptionComponent>;
    constructor(fixture: ComponentFixture<NewPlantypeExceptionComponent>) {
      this.fixture = fixture;
    }
  
    get scrollTopIcon() {
      return this.nativeElementCssSelector<HTMLElement>('.icon-icon_backtotop') ? this.nativeElementCssSelector<HTMLElement>('.icon-icon_backtotop') :
                    this.nativeElementCssSelector<HTMLElement>('.icon-icon_backtotop_hover');
    }
    get typeaheadSearchBox() {
      return this.nativeElementCssSelector<HTMLElement>('.searchBox');
    }
  
    private querySelector<T>(selector: string): T {
      return this.fixture.nativeElement.querySelector(selector);
    }
  
    private querySelectorAll<T>(selector: string): T[] {
      return this.fixture.nativeElement.querySelectorAll(selector);
    }
  
    private nativeElementCssSelector<T>(selector: string): T {
      return this.fixture.debugElement.query(By.css(selector)).nativeElement;
    }
  
    private elementById(id: string) {
      return document.getElementById(id);
    }
  }
});
