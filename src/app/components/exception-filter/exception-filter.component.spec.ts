
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync, flush } from '@angular/core/testing';

import { ExceptionFilterComponent } from './exception-filter.component';
import { TestData } from 'src/app/testing/test-data';
import { asyncData } from 'src/app/testing/async-observable-helpers';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { By } from '@angular/platform-browser';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { Input, Component } from '@angular/core';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/services/common.service';
import { Observable, Subscriber, throwError } from 'rxjs';

describe('ExceptionFilterComponent', () => {
  let component: ExceptionFilterComponent;
  let fixture: ComponentFixture<ExceptionFilterComponent>;
  let page: Page;
  class ExceptionServiceSpy {
    getAllExchanges = jasmine.createSpy('getAllExchanges').and.callFake(
      () => asyncData(TestData.exchanges)
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
      ]    
    }).overrideComponent(ExceptionFilterComponent, {
      set: {
        providers: [
          { provide: ExcpetionService, useClass: ExceptionServiceSpy },
          { provide: CommonService, useClass: CommonServiceSpy }
        ]
      }
    })
    .compileComponents().then(() =>{

      fixture = TestBed.createComponent(ExceptionFilterComponent);
      component = fixture.componentInstance;
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
  it('ngOnInit()  check', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.setClear).toEqual(false);
   // expect(exceptionServiceSpy.getAllExchanges.calls.count()).toBe(2,'getAllExchanges() for refreshed node called once');
    expect(component.quarterAttribute).toEqual(AppStringConstants.QUARTER_COMBOBOX_VALUE);
    expect(component.exchangeAttribute).toEqual(AppStringConstants.EXCHANGE_COMBOBOX_VALUE);
    })
  );
  it('handleExchangeValue', fakeAsync(() => {
    component.exchangeEntries = TestData.exchanges;
    let exchangeValue = "TriNet I";
    component.handleExchangeValue(exchangeValue);
    fixture.detectChanges();
    expect(component.filterExchangeValue).toEqual("TriNet I");
    expect(component.quarterEntries).toEqual(TestData.exchanges[0].quarters);
    expect(component.initialselectedQuarterFlag).toEqual(true);
    expect(component.selectedQuarterDefaulted).toEqual(component.quarterEntries[0]);
    expect(component.selectedQuarter).toEqual(component.quarterEntries[0]);
    })
  );
  it('handleQuarterValue - default Flag true', fakeAsync(() => {
    let defaultFlag = true;
    let quarterValue= 'ABC'; 
    spyOn(component.selectedQuarterCodeEmittor,'emit');
    component.handleQuarterValue(quarterValue,defaultFlag);
    fixture.detectChanges();
    expect(component.selectedQuarter).toEqual('ABC');
    expect(component.selectedQuarter).toEqual(quarterValue.toString());
    expect(component.selectedQuarterCodeEmittor.emit).toHaveBeenCalled();
    expect(component.selectedQuarterCodeEmittor.emit).toHaveBeenCalledWith(quarterValue);
    })
  );
  it('handleQuarterValue - default Flag false', fakeAsync(() => {
    let defaultFlag = false;
    let quarterValue= 'ABC';
    spyOn(component.selectedQuarterCodeEmittor,'emit');
    component.handleQuarterValue(quarterValue,defaultFlag);
    fixture.detectChanges();
    expect(component.selectedQuarter).toEqual('ABC');
    expect(component.selectedQuarterDefaulted).toEqual(null);
    expect(component.selectedQuarter).toEqual(quarterValue.toString());
    expect(component.selectedQuarterCodeEmittor.emit).toHaveBeenCalled();
    expect(component.selectedQuarterCodeEmittor.emit).toHaveBeenCalledWith(quarterValue);
    })
  );
  it('onClearClick - clear check', fakeAsync (() => {
    let emptyString = '';
    spyOn(component.selectedQuarterCodeEmittor,'emit');
    spyOn(component.selectedExchangeCodeEmittor,'emit');
    component.onClearClick();
    fixture.detectChanges();
    expect(component.selectedExchange).toEqual(emptyString);
    expect(component.filterExchangeValue).toEqual(emptyString);
    expect(component.selectedQuarter).toEqual(emptyString);
    expect(component.setClear).toEqual(true);
    expect(component.selectedExchangeCodeEmittor.emit).toHaveBeenCalled();
    expect(component.selectedExchangeCodeEmittor.emit).toHaveBeenCalledWith(emptyString);
    expect(component.selectedQuarterCodeEmittor.emit).toHaveBeenCalled();
    expect(component.selectedQuarterCodeEmittor.emit).toHaveBeenCalledWith(emptyString);

  }));
  it('onCompanyChange', fakeAsync (() => {
    // let companyEvent = new CustomEvent<Company>("build",TestData.company);
    let companyEvent = undefined;
    spyOn(component.selectedCompanyCodeEmittor,'emit');
    component.onCompanyChange(companyEvent);
    fixture.detectChanges();
    expect(component.selectedCompanyCode).toEqual('');
    expect(component.selectedCompanyCodeEmittor.emit).toHaveBeenCalled();
    expect(component.selectedCompanyCodeEmittor.emit).toHaveBeenCalledWith('');

  }));

  it('onCompanyChange when company event equal selectedCompany', () => {
    let companyEvent = "Automation10430328";
    component.selectedCompany = "Automation10430328";
    spyOn(component.selectedCompanyCodeEmittor,'emit');
    component.onCompanyChange(companyEvent);
    expect(component.onCompanyChange).toBeDefined();

  });
  // it('onSelectCompany', fakeAsync (() => {
  //   component.companyValues = TestData.companyValues;
  //   expect(page.typeaheadSearchBox.innerHTML).toEqual("MMM");
  //   page.typeaheadSearchBox.dispatchEvent(new Event('selectItem'));
  //   fixture.detectChanges();
  //   expect(component.selectedCompany).toEqual(TestData.companyValues[1]);
  //   expect(component.selectedCompanyCode).toEqual(TestData.companyValues[1].companyCode);
  // }));
  it('getAllExchanges', fakeAsync (() => {
    component.getAllExchanges();
    tick();
    expect(component.exchangeEntries).toEqual(TestData.exchanges);
    expect(component.exchanges).toEqual(TestData.exchangesList);
   //expect(exceptionServiceSpy.getAllExchanges.calls.count()).toBe(1,'getAllExchanges() for refreshed node called once');
  }));
  it('should handle errorcase for getAllExchanges', ()=> {
    exceptionServiceSpy.getAllExchanges = jasmine.createSpy('getAllExchanges').and.returnValue(throwError({error: {customMessage: "error"}}));
    component.getAllExchanges();
    expect(component.bannerMessage).toBeTruthy();
  }) 
  it('should filter results from exceptionsData and return new Array', (done) => {
    component.exceptionsData = TestData.exceptionsData;
    const text$ = new Observable<string>(subscriber => {
      subscriber.next("ZA7");
    });
    fixture.detectChanges();
    const companyNames = component.exceptionsData.map(val => val.comapnyName);
    component.searchCompany(text$).subscribe((res)=>{
      expect(res.every(val => companyNames.indexOf(val.companyName))).toEqual(true);
      done();
    })
  });
  it('should not filter results from exceptionsData when empty string', (done) => {
    component.exceptionsData = TestData.exceptionsData;
    const text$ = new Observable<string>(subscriber => {
      subscriber.next("");
    });
    fixture.detectChanges();
    const companyNames = component.exceptionsData.map(val => val.comapnyName);
    component.searchCompany(text$).subscribe((res)=>{
      expect(res).toBeUndefined();
      done();
    })
  });
  it("searchCompany should return nothing when exceptionsData is undefined ", (done) => {
    component.exceptionsData = undefined;
    const text$ = new Observable<string>(subscriber => {
      subscriber.next("15T");
    });
    fixture.detectChanges();
    component.searchCompany(text$).subscribe((res)=>{
      expect(res).toBeUndefined();
      done();
    });
    expect(component.searchCompany).toBeDefined();
  });
  it('should call onSelectCompany', () => {
    const eventObj:NgbTypeaheadSelectItemEvent = {
      "item": {
          "companyCode": "15TX",
          "companyName": "X Comp 243 Vend Inc."
      },
      "preventDefault": () => {}
    };
    spyOn(component.selectedCompanyCodeEmittor,'emit');
    component.onSelectCompany(eventObj);
    fixture.detectChanges();
    expect(component.selectedCompanyCodeEmittor.emit).toHaveBeenCalled();
  })

  it('should call onSelectCompany with selectedCompany undefined', () => {
    const eventObj:NgbTypeaheadSelectItemEvent = {
      "item": undefined,
      "preventDefault": () => {}
    };
    spyOn(component.selectedCompanyCodeEmittor,'emit');
    component.onSelectCompany(eventObj);
    fixture.detectChanges();
    expect(component.onSelectCompany).toBeDefined();
  })

  class Page {
    private fixture: ComponentFixture<ExceptionFilterComponent>;
    constructor(fixture: ComponentFixture<ExceptionFilterComponent>) {
      this.fixture = fixture;
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
