import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { ExceptionsComponent } from './exceptions.component';
import { CommonService } from 'src/app/services/common.service';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { asyncData, asyncError } from '../../testing/async-observable-helpers';
import { TestData } from '../../testing/test-data';
import { By } from '@angular/platform-browser';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { HttpTestingController } from '@angular/common/http/testing';
import { Input, Component } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SortEvent } from 'src/app/directives/sortable.directive';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';

describe('ExceptionsComponent', () => {
  let component: ExceptionsComponent;
  let fixture: ComponentFixture<ExceptionsComponent>;
  let page: Page;
  let matInput: MatDatepickerInputHarness[];

  class ExceptionServiceSpy {
    getAllExchanges = jasmine
      .createSpy('getAllExchanges')
      .and.callFake(() => asyncData(TestData.exchanges));

    getExceptionAttributes = jasmine
      .createSpy('getExceptionAttributes')
      .and.callFake(() => asyncData(TestData.exceptionAttributes));
    getAllExceptions = jasmine
      .createSpy('getAllExceptions')
      .and.callFake(() => asyncData(TestData.exceptions));
    getAllCompanies = jasmine
      .createSpy('getAllCompanies')
      .and.callFake(() => asyncData(TestData.company));
    editException = jasmine
      .createSpy('editException')
      .and.callFake(() => asyncData(TestData.exceptions[0]));
    getException = jasmine
      .createSpy('getException')
      .and.callFake(() => asyncData(TestData.editedException));
  }
  class CommonServiceSpy {
    loadSession = jasmine
      .createSpy('loadSession')
      .and.returnValue(Promise.resolve({ message: 'success' }));
    getCompanyId = jasmine.createSpy('getCompanyId').and.returnValue('001');
    getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue('00001940564');
  }
  let exceptionServiceSpy: ExceptionServiceSpy;
  let commonServiceSpy: CommonServiceSpy;

  beforeEach(
    waitForAsync(() => {
      @Component({
        selector: 'app-new-exception',
        template: '<div>Hey this is NewExceptionComponent </div>',
      })
      class NewExceptionComponent {
        @Input() approvers: any;
        @Input() exceptions: any;
        @Input() exceptionTypes: any;
        @Input() planTypes: any;
      }

      @Component({
        selector: 'app-exception-filter',
        template: '<div>Hey this is App Exception Filter Component </div>',
      })
      class ExceptionFilterComponent {
        @Input()
        exceptionsData: any[];
        @Input()
        clearFlag: boolean;
      }
      TestBed.configureTestingModule({
        imports: [AppModule],
        providers: [
          { provide: CommonService, useClass: CommonServiceSpy },
          { provide: ExcpetionService, useValue: {} },
        ],
      })
        .overrideComponent(ExceptionsComponent, {
          set: {
            providers: [
              { provide: ExcpetionService, useClass: ExceptionServiceSpy },
              { provide: CommonService, useClass: CommonServiceSpy },
            ],
          },
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ExceptionsComponent);
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
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component logic testing -', componentLogicTest);
  describe('component logic testing -', scrollUITest);
  function componentLogicTest() {
    it('test ngOnInit()', fakeAsync(() => {
      component.ngOnInit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        tick();
        expect(component.exceptionTypes).toEqual(TestData.exceptiontypes);
        expect(component.exceptionTypes.length).toEqual(
          TestData.exceptiontypes.length,
          'getAllExchanges should have ' + TestData.exchanges.length + ' exchanges returned'
        );
        expect(component.planTypes).toEqual(TestData.planTypes);
        expect(component.planTypes.length).toEqual(TestData.planTypes.length);
        expect(component.approvers).toEqual(TestData.approvers);
        expect(component.approvers.length).toEqual(
          TestData.approvers.length,
          'getAllApprovers should have ' + TestData.approvers.length + ' approvers returned'
        );
        expect(component.exceptionsData).toEqual(
          component.sort(TestData.exceptions, component.timestampColumn, '')
        );
        expect(component.exceptionsData.length).toEqual(TestData.exceptions.length);
        expect(component.sort(TestData.exceptions, component.timestampColumn, 'asc')).toBeDefined();
        component.onSort({ column: 'abc', direction: 'asc' });
        expect(
          component.sort(TestData.exceptions, component.timestampColumn, 'desc')
        ).toBeDefined();
      });
    }));

    it('handleApproverChange - approver changed', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let approver = '00001792653';
      let j = 0;
      let exceptionId = 10;
      component.approvers = TestData.approvers;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handleApproverChange(approver, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).approverId).toEqual(
        approver
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).approverName).toEqual(
        TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name
      );
    }));
    it('handleApproverChange - no approver chnaged', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let approver = '00002340287';
      let j = 2;
      let exceptionId = 17;
      component.approvers = TestData.approvers;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handleApproverChange(approver, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).approverId).toEqual(
        TestData.approvers.find(({ attributeValue }) => attributeValue === approver).attributeValue
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).approverName).toEqual(
        TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handleApproverChange - apporver list null', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let approver = '00002340287';
      let j = 2;
      let exceptionId = 17;
      component.approvers = null;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handleApproverChange(approver, exceptionId, j);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handlePlanTypeChange - changes made', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let planType = 10;
      let exceptionId = 10;
      let j = 0;
      component.planTypes = TestData.planTypes;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handlePlanTypeChange(planType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).planType).toEqual(
        planType
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    }));
    it('handlePlanTypeChange - no changes made', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let planType = 14;
      let exceptionId = 17;
      let j = 2;
      component.planTypes = TestData.planTypes;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handlePlanTypeChange(planType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).planType).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).planType
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handleApproverChange - planTypes list null', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let planType = 14;
      let exceptionId = 17;
      let j = 2;
      component.planTypes = null;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handlePlanTypeChange(planType, exceptionId, j);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handleExceptionTypeChange - exceptionTypeChanged', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let exceptionType = 'PCT';
      let exceptionId = 10;
      let j = 0;
      component.exceptionTypes = TestData.exceptiontypes;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handleExceptionTypeChange(exceptionType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundType).toEqual(
        exceptionType
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue).toEqual(0);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    }));
    it('handleExceptionTypeChange - exceptionType not Changed', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let exceptionType = 'PCT';
      let exceptionId = 17;
      let j = 2;
      component.exceptionTypes = TestData.exceptiontypes;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.handleExceptionTypeChange(exceptionType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundType).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).minFundType
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).minFundValue
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handleFundValueChange - fundValueChanged', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let exceptionType = 'PCT';
      let exceptionId = 17;
      let j = 2;
      component.exceptionTypes = TestData.exceptiontypes;
      component.exceptionsData = TestData.exceptions;
      component.exceptionsCloneData = JSON.parse(JSON.stringify(TestData.exceptions));
      component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue = 45;
      component.createRowEditableList();
      component.handleFundValueChange(exceptionType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundType).toEqual(
        exceptionType
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue).toEqual(
        45
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    }));

    it('handleFundValueChange - FundValue not Changed', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let exceptionType = 'NONE';
      let exceptionId = 10;
      let j = 0;
      component.exceptionTypes = TestData.exceptiontypes;
      component.exceptionsData = TestData.exceptions;
      component.exceptionsCloneData = JSON.parse(JSON.stringify(TestData.exceptions));
      component.exceptionsCloneData[0].minFundType = 3;
      component.createRowEditableList();
      component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue = 0;
      fixture.detectChanges();
      component.handleFundValueChange(exceptionType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundType).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).minFundType
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).minFundValue
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    }));
    it('handleFundValueChange - disableSaveButton', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let exceptionType = 'NONE';
      let exceptionId = 10;
      let j = 0;
      component.exceptionTypes = TestData.exceptiontypes;
      component.exceptionsData = TestData.exceptions;
      component.exceptionsCloneData = JSON.parse(JSON.stringify(TestData.exceptions));
      component.createRowEditableList();
      component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue = 0;
      fixture.detectChanges();
      component.handleFundValueChange(exceptionType, exceptionId, j);
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundType).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).minFundType
      );
      expect(component.exceptionsData.find(({ id }) => id === exceptionId).minFundValue).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId).minFundValue
      );
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('addNewException', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      expect(component.exceptionsData.length).toEqual(0);
      expect(component.rowEditableList.length).toEqual(0);
      component.addNewException(TestData.exceptions[0]);
      expect(component.exceptionsData.length).toEqual(1);
      expect(component.rowEditableList.length).toEqual(1);
    }));
    it('onUpdate', fakeAsync(() => {
      let index = 0;
      let exceptionId = 10;
      let mockExceptions = TestData.exceptions;
      component.exceptionsData = TestData.exceptions;
      component.exceptionsData[index] = TestData.editedException;
      let message =
        'Minimum Funding Exception for ' +
        mockExceptions.find(({ id }) => id === exceptionId).companyName +
        ' has been successfully updated';
      component.onUpdate(index, exceptionId);
      tick();
      fixture.detectChanges();
      expect(exceptionServiceSpy.editException.calls.count()).toBe(
        1,
        'editException() called once'
      );
      expect(exceptionServiceSpy.editException).toHaveBeenCalledWith(
        '001',
        '00001940564',
        TestData.editedException
      );
      expect(component.exceptionsData).toEqual(
        component.sort(mockExceptions, component.timestampColumn, '')
      );
      expect(component.bannerMessage).toEqual(
        new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true)
      );
      expect(component.filterExchangeValue).toEqual('');
      expect(component.selectedQuarter).toEqual('');
      expect(component.selectedCompanyCode).toEqual('');
    }));
    it('should handle error case for editException', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        status: 401,
        statusText: 'Not Found',
      });
      component.exceptionsData = TestData.exceptionsData;
      exceptionServiceSpy.editException = jasmine
        .createSpy('editException')
        .and.returnValue(throwError(errorResponse));
      component.onUpdate(0, 15);
      expect(component.onUpdate).toBeDefined();
    });
    it('should handle error case for editException with status code other than 401 and 403', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        status: 404,
        statusText: 'Not Found',
      });
      component.exceptionsData = TestData.exceptionsData;
      exceptionServiceSpy.editException = jasmine
        .createSpy('editException')
        .and.returnValue(throwError(errorResponse));
      component.onUpdate(0, 15);
      expect(component.onUpdate).toBeDefined();
    });

    it('handleNewExceptionBanner', fakeAsync(() => {
      let bannerMessage: BannerMessage = new BannerMessage(
        '',
        AppStringConstants.TYPE_SUCCESS,
        true
      );
      component.handleNewExceptionBanner(bannerMessage);
      expect(component.bannerMessage).toEqual(bannerMessage);
    }));
    it(
      'getMaxLimitFundValue - when -' + AppStringConstants.EXCEPTION_TYPES[0],
      fakeAsync(() => {
        expect(component.getMaxLimitFundValue(AppStringConstants.EXCEPTION_TYPES[0])).toEqual(100);
      })
    );
    it(
      'getMaxLimitFundValue - when -' + AppStringConstants.EXCEPTION_TYPES[1],
      fakeAsync(() => {
        expect(component.getMaxLimitFundValue(AppStringConstants.EXCEPTION_TYPES[1])).toEqual(
          10000
        );
      })
    );
    it(
      'getMaxLimitFundValue - when -' + AppStringConstants.EXCEPTION_TYPES[2],
      fakeAsync(() => {
        expect(component.getMaxLimitFundValue(AppStringConstants.EXCEPTION_TYPES[2])).toEqual(0);
      })
    );
    it('onEditClick - edit check', fakeAsync(() => {
      let index = 0;
      let exceptionId = 12;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.onEditClick(index, exceptionId);
      fixture.detectChanges();
      expect(component.rowEditableList[index].editable).toEqual(false);
    }));
    it('onEditClick - refresh check', fakeAsync(() => {
      let index = 0;
      let exceptionId = 12;
      component.exceptionsData = TestData.exceptions;
      component.createRowEditableList();
      component.rowEditableList[index].editable = false;
      component.onEditClick(index, exceptionId);
      fixture.detectChanges();
      expect(component.rowEditableList[index].editable).toEqual(true);
      expect(exceptionServiceSpy.getException.calls.count()).toBe(
        1,
        'getException() for refreshed node called once'
      );
      expect(exceptionServiceSpy.getException).toHaveBeenCalledWith(
        '001',
        '00001940564',
        exceptionId
      );
      tick();
      expect(component.exceptionsData.find(({ id }) => id === exceptionId)).toEqual(
        TestData.exceptions.find(({ id }) => id === exceptionId)
      );
    }));
    it('should test compare', () => {
      expect(component.compare(10, 11)).toBe(-1);
    });
    it('should test onSort when header sort equals colomn', () => {
      const obj: SortEvent = {
        column: 'Company ID',
        direction: '',
      };
      component.onSort(obj);
      expect(component.onSort).toBeDefined();
    });
    it('should check for null condition for shallowCompare', () => {
      component.shallowCompare(null, null);
      expect(component.shallowCompare).toBeDefined();
    });
    it('should check for undefined value for disableSaveButton call', () => {
      component.disableSaveButton(-1);
      expect(component.disableSaveButton).toBeDefined();
    });
    it('should check for undefined value for enableSaveButton call', () => {
      component.enableSaveButton(-1);
      expect(component.enableSaveButton).toBeDefined();
    });
    it('should null check exceptionsData in handleFundValueChange', () => {
      component.exceptionsData = null;
      component.handleFundValueChange(1, 2, 3);
      expect(component.handleFundValueChange).toBeDefined();
    });
    it('should null check exceptionsData in handleExceptionTypeChange', () => {
      component.exceptionsData = null;
      component.handleExceptionTypeChange(1, 2, 3);
      expect(component.handleExceptionTypeChange).toBeDefined();
    });
    xit('should test getStartDate and getEndDate', async () => {
      const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
      matInput = await loader.getAllHarnesses(MatDatepickerInputHarness);
      await matInput[0].setValue('1/1/2020');
      expect(await matInput[0].getValue()).toBe('1/1/2020');
      await matInput[1].setValue('1/1/2020');
      expect(await matInput[1].getValue()).toBe('1/1/2020');
    });
  }

  function scrollUITest() {
    it('when window scrolled more than 200px', () => {
      expect(component.fixed).toBeFalsy('component.fixed should be false');
      window.scrollTo(0, 220);

      var div = document.createElement('div');
      // it also needs enough content to actually be scrollable (won't work without this)
      div.innerHTML =
        '<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x<br>x';

      document.body.prepend(div);
      window.scrollBy(0, 300);
      window.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      // expect(component.fixed).toBeTruthy('component.fixed should be true');
      try {
        // throws error since it is not in dom.
        page.scrollTopIcon;
      } catch (e) {
        expect(e.message).toEqual(`Cannot read property 'nativeElement' of null`);
      }
    });
    it('when window scrolled less than 200px', () => {
      fixture.detectChanges();
      // sanity check
      expect(component.fixed).toBeFalsy('component.fixed should be false');
      window.scrollTo(0, 190);
      window.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(component.fixed).toBeFalsy('component.fixed should be false');
      try {
        // throws error since it is not in dom.
        page.scrollTopIcon;
      } catch (e) {
        expect(e.message).toEqual(`Cannot read property 'nativeElement' of null`);
      }
    });
    it('when scrolltop icon clicked', () => {
      expect(component.fixed).toBeFalsy('component.fixed should be false');
      window.scrollTo(0, 600);
      window.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      // expect(component.fixed).toBeTruthy('component.fixed should be true');
      page.scrollTopIcon.click();
      expect(window.scrollX).toBe(0);
      expect(window.scrollY).toBe(0);
    });
    it('should handle error case for getExceptionAttributes', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        status: 401,
        statusText: 'Not Found',
      });
      exceptionServiceSpy.getExceptionAttributes = jasmine
        .createSpy('getExceptionAttributes')
        .and.callFake(() => asyncError(errorResponse));
      component.getExceptionAttributes();
      expect(component.getExceptionAttributes).toBeDefined();
    });
    it('should handle error case for getExceptionAttributes with status code other than 401 and 403', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        status: 404,
        statusText: 'Not Found',
      });
      exceptionServiceSpy.getExceptionAttributes = jasmine
        .createSpy('getExceptionAttributes')
        .and.returnValue(throwError(errorResponse));
      component.getExceptionAttributes();
      expect(component.getExceptionAttributes).toBeDefined();
    });
    it('should handle error case for getAllExceptions', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        status: 401,
        statusText: 'Not Found',
      });
      exceptionServiceSpy.getAllExceptions = jasmine
        .createSpy('getAllExceptions')
        .and.returnValue(throwError(errorResponse));
      component.getAllExceptions();
      expect(component.getAllExceptions).toBeDefined();
    });
    it('should handle error case for getAllExceptions with status code other than 401 and 403', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        status: 404,
        statusText: 'Not Found',
      });
      exceptionServiceSpy.getAllExceptions = jasmine
        .createSpy('getAllExceptions')
        .and.returnValue(throwError(errorResponse));
      component.getAllExceptions();
      expect(component.getAllExceptions).toBeDefined();
    });
  }

  class Page {
    private fixture: ComponentFixture<ExceptionsComponent>;
    constructor(fixture: ComponentFixture<ExceptionsComponent>) {
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
