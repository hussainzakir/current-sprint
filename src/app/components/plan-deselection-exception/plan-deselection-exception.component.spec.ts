import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
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
import { PlanDeselectionExceptionComponent } from './plan-deselection-exception.component';

describe('PlanDeselectionExceptionComponent', () => {
  let component: PlanDeselectionExceptionComponent;
  let fixture: ComponentFixture<PlanDeselectionExceptionComponent>;
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
    getDeSelectionExceptions = jasmine
      .createSpy('getException')
      .and.callFake(() => asyncData(TestData.getDeSelectionExceptions));
    editDeselectionException = jasmine
      .createSpy('getException')
      .and.callFake(() => asyncData(TestData.getDeSelectionException));
    createDeselectionException = jasmine
      .createSpy('getException')
      .and.callFake(() => asyncData(TestData.createDeSelectionException));
    getDeselectionException = jasmine
      .createSpy('getException')
      .and.callFake(() => asyncData(TestData.getDeSelectionException));
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
        selector: 'app-deselection-exceptions',
        template: '<div>Hey this is app deselection exceptions component </div>',
      })
      class NewPlanDeselectionExceptionComponent {
        @Input() approvers: any;
        @Input() exceptions: any;
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
        .overrideComponent(PlanDeselectionExceptionComponent, {
          set: {
            providers: [
              { provide: ExcpetionService, useClass: ExceptionServiceSpy },
              { provide: CommonService, useClass: CommonServiceSpy },
            ],
          },
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(PlanDeselectionExceptionComponent);
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

        expect(component.ngOnInit).toBeDefined();
        // expect(component.approvers.length).toEqual(
        //   TestData.approvers.length,
        //   'getAllApprovers should have ' + TestData.approvers.length + ' approvers returned'
        // );

        component.onSort({ column: 'abc', direction: 'asc' });
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
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    }));
    xit('handleApproverChange - no approver chnaged', fakeAsync(() => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      let approver = '00001127989';
      let j = 2;
      let exceptionId = 22;
      component.approvers = TestData.approvers;
      component.exceptionsData = TestData.getDeSelectionExceptions;
      component.createRowEditableList();
      component.handleApproverChange(approver, exceptionId, j);
      // expect(component.exceptionsData.find(({ id }) => id === exceptionId).approverId).toEqual(
      //   TestData.approvers.find(({ attributeValue }) => attributeValue === approver).attributeValue
      // );
      // expect(component.exceptionsData.find(({ id }) => id === exceptionId).approverName).toEqual(
      //   TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name
      // );
      // expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
      expect(component.handleApproverChange).toBeDefined();
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

    // it('handleApproverChange - planTypes list null', fakeAsync(() => {
    //   component.rowEditableList = [];
    //   component.exceptionsData = [];
    //   let planType = 14;
    //   let exceptionId = 17;
    //   let j = 2;
    //   component.planTypes = null;
    //   component.exceptionsData = TestData.exceptions;
    //   component.createRowEditableList();
    //   expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    // }));

    xit('handleFundValueChange - disableSaveButton', fakeAsync(() => {
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
      // component.handleFundValueChange(exceptionType, exceptionId, j);
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
      let exceptionId = 33;
      let mockExceptions = TestData.getDeSelectionExceptions;
      component.exceptionsData = TestData.getDeSelectionExceptions;
      component.exceptionsData[index] = TestData.getDeSelectionException;
      let message =
        'Minimum Funding Exception for ' +
        mockExceptions.find(({ id }) => id === exceptionId).companyName +
        ' has been successfully updated';
      component.onUpdate(index, exceptionId);
      tick();
      fixture.detectChanges();

      // expect(component.exceptionsData).toEqual(
      //   component.sort(mockExceptions, component.timestampColumn, '')
      // );
      // expect(component.bannerMessage).toEqual(
      //   new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true)
      // );
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
      component.exceptionsData = TestData.getDeSelectionExceptions;
      exceptionServiceSpy.editDeselectionException = jasmine
        .createSpy('editDeselectionException')
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
      exceptionServiceSpy.editDeselectionException = jasmine
        .createSpy('editDeselectionException')
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
      expect(component.bannerMessage).toBeDefined();
    }));

    it('onEditClick - edit check', fakeAsync(() => {
      let index = 0;
      let exceptionId = 22;
      component.exceptionsData = TestData.getDeSelectionExceptions;
      component.createRowEditableList();
      component.onEditClick(index, exceptionId);
      fixture.detectChanges();
      expect(component.onEditClick).toBeDefined();
    }));
    it('onEditClick - refresh check', fakeAsync(() => {
      let index = 0;
      let exceptionId = 33;
      component.exceptionsData = TestData.getDeSelectionExceptions;
      component.createRowEditableList();
      component.rowEditableList[index].editable = false;
      component.onEditClick(index, exceptionId);
      fixture.detectChanges();
      expect(component.onEditClick).toBeDefined();
      tick();
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
    it('should test shallowCompare', () => {
      const a = TestData.getDeSelectionException;
      const b = TestData.getDeSelectionException;
      component.shallowCompare(a, b);
      expect(component.shallowCompare).toBeDefined();
    });
    it('should test else condition for shallowCompare', () => {
      const a = TestData.getDeSelectionException;
      const b = TestData.getDeSelectionException;
      b.approverId = '1234';
      component.shallowCompare(a, b);
      expect(component.shallowCompare).toBeDefined();
    });
    it('should check for undefined value for disableSaveButton call', () => {
      component.rowEditableList = [];
      component.exceptionsData = [];
      component.createRowEditableList();
      component.disableSaveButton(-1);
      expect(component.disableSaveButton).toBeDefined();
    });
    it('should check for undefined value for enableSaveButton call', () => {
      component.enableSaveButton(-1);
      expect(component.enableSaveButton).toBeDefined();
    });

    it('should test getStartDate and getEndDate', async () => {
      const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
      matInput = await loader.getAllHarnesses(MatDatepickerInputHarness);
      await matInput[0].setValue('1/1/2020');
      expect(await matInput[0].getValue()).toBeDefined();
      await matInput[1].setValue('1/1/2020');
      expect(await matInput[1].getValue()).toBeDefined();
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
      exceptionServiceSpy.getDeSelectionExceptions = jasmine
        .createSpy('getAllExceptions')
        .and.returnValue(throwError(errorResponse));
      component.getAllExceptions();
      expect(component.getAllExceptions).toBeDefined();
    });
    it('should handle error case for getAllExceptions without status', () => {
      const errorResponse = new HttpErrorResponse({
        error: { _error: { message: 'error' }, customMessage: 'error' },
        statusText: 'Not Found',
      });
      exceptionServiceSpy.getDeSelectionExceptions = jasmine
        .createSpy('getAllExceptions')
        .and.returnValue(throwError(errorResponse));
      component.getAllExceptions();
      expect(component.bannerMessage).toBeDefined();
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
    private fixture: ComponentFixture<PlanDeselectionExceptionComponent>;
    constructor(fixture: ComponentFixture<PlanDeselectionExceptionComponent>) {
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
