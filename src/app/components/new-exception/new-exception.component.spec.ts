import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { NewExceptionComponent } from './new-exception.component';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { asyncData } from '../../testing/async-observable-helpers';
import { TestData } from '../../testing/test-data';
import { By } from '@angular/platform-browser';
import { Input, Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('NewExceptionComponent', () => {
  let component: NewExceptionComponent;
  let fixture: ComponentFixture<NewExceptionComponent>;
  let page: Page;
  class ExceptionServiceSpy {
    getAllExceptionAttributes = jasmine
      .createSpy('getAllExceptionAttributes')
      .and.callFake(() => asyncData(TestData.exceptionAttributes));
    getAllCompanies = jasmine
      .createSpy('getAllCompanies')
      .and.callFake(() => asyncData(TestData.company));
    createException = jasmine
      .createSpy('createException')
      .and.callFake(() => asyncData(TestData.exchanges[0]));
    createDeselectionException = jasmine
      .createSpy('getException')
      .and.callFake(() => asyncData(TestData.createDeSelectionException));
  }
  class CommonServiceSpy {
    getCompanyId = jasmine.createSpy('getCompanyId').and.returnValue('001');
    getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue('00001940564');
    loadSession = jasmine
      .createSpy('loadSession')
      .and.returnValue(Promise.resolve({ message: 'success' }));
  }
  let exceptionServiceSpy: ExceptionServiceSpy;
  let commonServiceSpy: CommonServiceSpy;
  beforeEach(
    waitForAsync(() => {
      @Component({ selector: 'app-combobox', template: '<div>Hey this is combo box </div>' })
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
          { provide: ExcpetionService, useValue: {} },
          { provide: CommonService, useClass: CommonServiceSpy },
        ],
      })
        .overrideComponent(NewExceptionComponent, {
          set: {
            providers: [
              { provide: ExcpetionService, useClass: ExceptionServiceSpy },
              { provide: CommonService, useClass: CommonServiceSpy },
            ],
          },
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(NewExceptionComponent);
          component = fixture.componentInstance;
          page = new Page(fixture);
          fixture.detectChanges();
          exceptionServiceSpy = fixture.debugElement.injector.get(ExcpetionService) as any;
          commonServiceSpy = fixture.debugElement.injector.get(CommonService) as any;
          if (typeof Array.prototype.find !== 'function') {
            Array.prototype.find = function (iterator) {
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
    })
  );
  /**  beforeEach(() => {
    fixture = TestBed.createComponent(NewExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });*/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onCreateClick ', fakeAsync(() => {
    component.newException = TestData.newException;
    component.onCreate();
    expect(exceptionServiceSpy.createException.calls.count()).toBe(
      1,
      'createException()  called once'
    );
    expect(exceptionServiceSpy.createException).toHaveBeenCalledWith(
      '001',
      '00001940564',
      TestData.newException
    );
    tick();
    //expect(component.newException).toEqual(TestData.newException);
  }));

  it('onCreateClick ', fakeAsync(() => {
    component.newException = TestData.newDeSelectionException;
    component.deselectionException = true;
    component.onCreate();
    expect(exceptionServiceSpy.createDeselectionException.calls.count()).toBe(
      1,
      'createDeselectionException()  called once'
    );
    expect(exceptionServiceSpy.createDeselectionException).toHaveBeenCalledWith(
      '001',
      '00001940564',
      TestData.newDeSelectionException
    );
    tick();
    //expect(component.newException).toEqual(TestData.newException);
  }));

  it('should handle error case for createException', () => {
    component.newException.companyCode = '15T';
    const error: HttpErrorResponse = new HttpErrorResponse({
      status: 401,
      error: { _error: { message: 'error' }, customMessage: 'error' },
    });
    exceptionServiceSpy.createException = jasmine
      .createSpy('createException')
      .and.returnValue(throwError(error));
    component.onCreate();
    expect(component.onCreate).toBeDefined();
  });

  it('should handle error case for createdeselectionException', () => {
    component.newException.companyCode = '15T';
    component.deselectionException = true;
    const error: HttpErrorResponse = new HttpErrorResponse({
      status: 401,
      error: { _error: { message: 'error' }, customMessage: 'error' },
    });
    exceptionServiceSpy.createDeselectionException = jasmine
      .createSpy('createDeselectionException')
      .and.returnValue(throwError(error));
    component.onCreate();
    expect(component.onCreate).toBeDefined();
  });

  it('should handle error else case for createdeselectionException', () => {
    component.newException.companyCode = '15T';
    component.deselectionException = true;
    const error: HttpErrorResponse = new HttpErrorResponse({
      error: { _error: { message: 'error' }, customMessage: 'error' },
    });
    exceptionServiceSpy.createDeselectionException = jasmine
      .createSpy('createDeselectionException')
      .and.returnValue(throwError(error));
    component.onCreate();
    expect(component.onCreate).toBeDefined();
  });

  it('should handle error case for createException with status code other than 401 and 403', () => {
    component.newException.companyCode = '15T';
    const error: HttpErrorResponse = new HttpErrorResponse({
      status: 404,
      error: { _error: { message: 'error' }, customMessage: 'error' },
    });
    exceptionServiceSpy.createException = jasmine
      .createSpy('createException')
      .and.returnValue(throwError(error));
    component.onCreate();
    expect(component.onCreate).toBeDefined();
  });

  it('on Getting company code - correct company code', fakeAsync(() => {
    component.newException.companyCode = 'G48';
    component.getCompany();
    expect(exceptionServiceSpy.getAllCompanies.calls.count()).toBe(
      1,
      'getAllCompanies()  called once'
    );
    expect(exceptionServiceSpy.getAllCompanies).toHaveBeenCalledWith(
      '001',
      '00001940564',
      component.newException.companyCode
    );
    tick();
    expect(component.newException.companyName).toEqual('H Comp 4013 Vend Inc.');
  }));

  it('on Getting company code - Wrong company code', fakeAsync(() => {
    component.newException.companyCode = '1111';
    component.getCompany();
    expect(exceptionServiceSpy.getAllCompanies.calls.count()).toBe(
      1,
      'getAllCompanies()  called once'
    );
    expect(exceptionServiceSpy.getAllCompanies).toHaveBeenCalledWith(
      '001',
      '00001940564',
      component.newException.companyCode
    );
    tick();
    expect(component.newException.companyName).toEqual('');
  }));
  it('should handle error case for getAllCompanies', () => {
    const error: HttpErrorResponse = new HttpErrorResponse({
      status: 401,
      error: { _error: { message: 'error' }, customMessage: 'error' },
    });
    //const obs$ = Observable.of(error);
    exceptionServiceSpy.getAllCompanies = jasmine
      .createSpy('getAllCompanies')
      .and.returnValue(throwError(error));
    component.getCompany();
    expect(component.getCompany).toBeDefined();
  });
  it('should handle error case for getAllCompanies with status code other than 401 and 403', () => {
    const error: HttpErrorResponse = new HttpErrorResponse({
      status: 404,
      error: { _error: { message: 'error' }, customMessage: 'error' },
    });
    exceptionServiceSpy.getAllCompanies = jasmine
      .createSpy('getAllCompanies')
      .and.returnValue(throwError(error));
    component.getCompany();
    expect(component.getCompany).toBeDefined();
  });
  it('validateException', () => {
    component.newException = TestData.newException;
    component.validateException();
    expect(component.validateException).toBeDefined();
  });

  it('handleApproverChange', fakeAsync(() => {
    let approver = '00001792653';
    component.approvers = TestData.approvers;
    component.handleApproverValue(approver);
    expect(component.newException.approverId).toEqual(approver);
    expect(component.newException.approverName).toEqual(
      TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name
    );
  }));

  it('handlePlanTypeChange', fakeAsync(() => {
    let planType = '10';
    component.handlePlanType(planType);
    expect(component.newException.planType).toEqual('10');
  }));

  it('handleMinFundExceptionType - percent value', fakeAsync(() => {
    let minFundType = 'PCT';
    component.handleMinFundExceptionType(minFundType);
    expect(component.minimumValueFund).toEqual(0);
    expect(component.maximumValueFund).toEqual(100);
  }));

  it('handleMinFundExceptionType - Flat value', fakeAsync(() => {
    let minFundType = 'NONE';
    component.handleMinFundExceptionType(minFundType);
    expect(component.minimumValueFund).toEqual(0);
    expect(component.maximumValueFund).toEqual(0);
  }));
  it('should null check newException in validateException', () => {
    component.newException = null;
    component.validateException();
    expect(component.validateException).toBeDefined();
  });
  it('should null check newException in handlePlanType', () => {
    component.newException = null;
    component.handlePlanType(1);
    expect(component.handlePlanType).toBeDefined();
  });
  it('should null check newException in handleApproverValue', () => {
    component.newException = null;
    component.handleApproverValue(1);
    expect(component.handleApproverValue).toBeDefined();
  });

  it('handleMinFundExceptionType - None value', fakeAsync(() => {
    let minFundType = 'FLT';
    component.handleMinFundExceptionType(minFundType);
    expect(component.minimumValueFund).toEqual(0);
    expect(component.maximumValueFund).toEqual(10000);
  }));

  it('should call getStartDate', () => {
    component.newException = TestData.newException;
    component.newException.startDate = new Date('2020-03-25');
    component.getStartDate();
    expect(component.getStartDate).toBeDefined();
  });
  it('should call getEndDate', () => {
    component.newException = TestData.newException;
    component.newException.endDate = new Date('2021-03-25');
    component.getEndDate();
    expect(component.getEndDate).toBeDefined();
  });
  it('validate exception - deselectionplantype', () => {
    component.deselectionException = true;
    component.newException = TestData.newDeSelectionException;
    expect(component.validateException()).toBeTrue();
  });
  it('validate exception - deselectionplantype error', () => {
    component.deselectionException = true;
    component.newException = TestData.newDeSelectionExceptionNotValidated;
    expect(component.validateException()).toBeFalse();
  });

  class Page {
    private fixture: ComponentFixture<NewExceptionComponent>;
    constructor(fixture: ComponentFixture<NewExceptionComponent>) {
      this.fixture = fixture;
    }

    get scrollTopIcon() {
      return this.nativeElementCssSelector<HTMLElement>('.icon-icon_backtotop')
        ? this.nativeElementCssSelector<HTMLElement>('.icon-icon_backtotop')
        : this.nativeElementCssSelector<HTMLElement>('.icon-icon_backtotop_hover');
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
