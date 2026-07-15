import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { PlantypeExceptionsComponent } from './plantype-exceptions.component';
import { asyncData } from 'src/app/testing/async-observable-helpers';
import { TestData } from 'src/app/testing/test-data';
import { By } from '@angular/platform-browser';
import { CommonService } from 'src/app/services/common.service';
import { AppModule } from 'src/app/app.module';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { Component, Input } from '@angular/core';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { MatDatepickerInputEvent, MatDatepickerInput } from '@angular/material/datepicker';
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SortEvent } from 'src/app/directives/sortable.directive';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';

describe('PlantypeExceptionsComponent', () => {
  let component: PlantypeExceptionsComponent;
  let fixture: ComponentFixture<PlantypeExceptionsComponent>;
  let page: Page;

  class ExceptionServiceSpy {
    getAllExchanges = jasmine
      .createSpy('getAllExchanges')
      .and.callFake(() => asyncData(TestData.exchanges));
    getAllBenOfferExceptions = jasmine
      .createSpy('getAllBenOfferExceptions')
      .and.callFake(() => asyncData(TestData.planTypeExceptions));
    getAllCompanies = jasmine
      .createSpy('getAllCompanies')
      .and.callFake(() => asyncData(TestData.company));
    editBenOfferException = jasmine
      .createSpy('editBenOfferException')
      .and.callFake(() => asyncData(TestData.editedBenOfferException));
    getBenOfferException = jasmine
      .createSpy('getBenOfferException')
      .and.callFake(() => asyncData(TestData.editedBenOfferException));
    getExceptionAttributes = jasmine
      .createSpy('getExceptionAttributes')
      .and.callFake(() => asyncData(TestData.exceptionAttributes));
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
      @Component({
        selector: 'app-new-plantype-exception',
        template: '<div>Hey this is NewExceptionComponent </div>',
      })
      class NewPlantypeExceptionComponent {
        @Input() approvers: any;
        @Input() exceptions: any;
        @Input() exceptionTypes: any;
        @Input() planTypes: any;
        @Input() offeredTypes: any;
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
        .overrideComponent(PlantypeExceptionsComponent, {
          set: {
            providers: [
              { provide: ExcpetionService, useClass: ExceptionServiceSpy },
              { provide: CommonService, useClass: CommonServiceSpy },
            ],
          },
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(PlantypeExceptionsComponent);
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
        expect(component.planTypes).toEqual(TestData.benOfferPlanTypes);
        expect(component.planTypes.length).toEqual(TestData.benOfferPlanTypes.length);
        expect(component.approvers).toEqual(TestData.approvers);
        expect(component.approvers.length).toEqual(
          TestData.approvers.length,
          'getAllApprovers should have ' + TestData.approvers.length + ' approvers returned'
        );
        expect(component.benOfferExceptionsData).toEqual(
          component.sort(TestData.planTypeExceptions, component.timestampColumn, '')
        );
        expect(component.benOfferExceptionsData.length).toEqual(TestData.planTypeExceptions.length);
        expect(
          component.sort(TestData.planTypeExceptions, component.timestampColumn, 'asc')
        ).toBeDefined();
        component.onSort({ column: 'abc', direction: 'asc' });
        expect(
          component.sort(TestData.planTypeExceptions, component.timestampColumn, 'desc')
        ).toBeDefined();
      });
    }));

    // it('handleApproverChange - approver changed', fakeAsync(() => {
    //   component.rowEditableList = [];
    //   component.benOfferExceptionsData = [];
    //   let approver = "00001128274";
    //   let j = 0;
    //   let exceptionId = 15;
    //   component.approvers = TestData.approvers;
    //   component.benOfferExceptionsData = TestData.planTypeExceptions;
    //   component.createRowEditableList();
    //   component.handleApproverChange(approver,exceptionId,j);
    //   expect(component.benOfferExceptionsData.find(({ id }) => id === exceptionId).approverId).toEqual(approver);
    //   expect(component.benOfferExceptionsData.find(({ id }) => id === exceptionId).approverName).toEqual(TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name);
    //   expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    // })
    // );
    it('should handle error case for getAllBenOfferExceptions', () => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 401,
        error: { _error: { message: 'error', customMessage: 'error' } },
      });
      exceptionServiceSpy.getAllBenOfferExceptions = jasmine
        .createSpy('getAllBenOfferExceptions')
        .and.returnValue(throwError(error));
      component.getAllPlanTypeExceptions();
      expect(component.getAllPlanTypeExceptions).toBeDefined();
    });
    it('should handle error case for getAllBenOfferExceptions error status other than 401 and 403', () => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        error: { _error: { message: 'error', customMessage: 'error' } },
      });
      exceptionServiceSpy.getAllBenOfferExceptions = jasmine
        .createSpy('getAllBenOfferExceptions')
        .and.returnValue(throwError(error));
      component.getAllPlanTypeExceptions();
      expect(component.getAllPlanTypeExceptions).toBeDefined();
    });
    it('should handle error case for getExceptionAttributes', () => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 403,
        error: { _error: { message: 'error', customMessage: 'error' } },
      });
      exceptionServiceSpy.getExceptionAttributes = jasmine
        .createSpy('getExceptionAttributes')
        .and.returnValue(throwError(error));
      component.getExceptionAttributes();
      expect(component.getExceptionAttributes).toBeDefined();
    });
    it('should handle error case for getExceptionAttributes with error status other than 401 and 403', () => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        error: { _error: { message: 'error', customMessage: 'error' } },
      });
      exceptionServiceSpy.getExceptionAttributes = jasmine
        .createSpy('getExceptionAttributes')
        .and.returnValue(throwError(error));
      component.getExceptionAttributes();
      expect(component.getExceptionAttributes).toBeDefined();
    });
    it('handleApproverChange - no approver chnaged', fakeAsync(() => {
      component.rowEditableList = [];
      component.benOfferExceptionsData = [];
      let approver = '00002340287';
      let j = 1;
      let exceptionId = 24;
      component.approvers = TestData.approvers;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.handleApproverChange(approver, exceptionId, j);
      expect(
        component.benOfferExceptionsData.find(({ id }) => id === exceptionId).approverId
      ).toEqual(
        TestData.approvers.find(({ attributeValue }) => attributeValue === approver).attributeValue
      );
      expect(
        component.benOfferExceptionsData.find(({ id }) => id === exceptionId).approverName
      ).toEqual(TestData.approvers.find(({ attributeValue }) => attributeValue === approver).name);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handleApproverChange - apporver list null', fakeAsync(() => {
      component.rowEditableList = [];
      component.benOfferExceptionsData = [];
      let approver = '00001127989';
      let j = 1;
      let exceptionId = 24;
      component.approvers = null;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.handleApproverChange(approver, exceptionId, j);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    // it('handlePlanTypeChange - changes made', fakeAsync(() => {
    //   component.rowEditableList = [];
    //   component.benOfferExceptionsData = [];
    //   let planType = "23";
    //   let exceptionId = 15;
    //   let j = 0;
    //   component.planTypes = TestData.benOfferPlanTypes;
    //   component.benOfferExceptionsData = TestData.planTypeExceptions;
    //   component.createRowEditableList();
    //   component.handlePlanTypeChange(planType,exceptionId,j);
    //   expect(component.benOfferExceptionsData.find(({ id }) => id === exceptionId).planType).toEqual(planType);
    //   expect(component.rowEditableList[j].saveButtonEditable).toEqual(true);
    //   })
    // );
    it('handlePlanTypeChange - no changes made', fakeAsync(() => {
      component.rowEditableList = [];
      component.benOfferExceptionsData = [];
      let planType = '14';
      let exceptionId = 41;
      let j = 11;
      component.planTypes = TestData.benOfferPlanTypes;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.handlePlanTypeChange(planType, exceptionId, j);
      expect(
        component.benOfferExceptionsData.find(({ id }) => id === exceptionId).planType
      ).toEqual(TestData.planTypeExceptions.find(({ id }) => id === exceptionId).planType);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));
    it('handlePlanTypeChange - planTypes list null', fakeAsync(() => {
      component.rowEditableList = [];
      component.benOfferExceptionsData = [];
      let planType = '10';
      let exceptionId = 24;
      let j = 1;
      component.planTypes = null;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.benOfferExceptionsData = null;
      component.handlePlanTypeChange(planType, exceptionId, j);
      expect(component.rowEditableList[j].saveButtonEditable).toEqual(false);
    }));

    it('addNewException', fakeAsync(() => {
      component.rowEditableList = [];
      component.benOfferExceptionsData = [];
      expect(component.benOfferExceptionsData.length).toEqual(0);
      expect(component.rowEditableList.length).toEqual(0);
      component.addNewBenOfferException(TestData.planTypeExceptions[0]);
      expect(component.benOfferExceptionsData.length).toEqual(1);
      expect(component.rowEditableList.length).toEqual(1);
    }));
    it('onUpdate', fakeAsync(() => {
      let index = 0;
      let exceptionId = 15;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.onUpdate(index, exceptionId);
      //Object.assign(component.benOfferExceptionsData.find(({ id }) => id === exceptionId),TestData.editedBenOfferException);
      let message =
        'Plan Type Exception for ' +
        component.benOfferExceptionsData.find(({ id }) => id === exceptionId).companyName +
        ' has been successfully updated';
      tick();
      fixture.detectChanges();
      expect(exceptionServiceSpy.editBenOfferException.calls.count()).toBe(
        1,
        'editBenOfferException() called once'
      );
      expect(component.bannerMessage).toEqual(
        new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true)
      );
      expect(component.filterExchangeValue).toEqual('');
      expect(component.selectedQuarter).toEqual('');
      expect(component.selectedCompanyCode).toEqual('');
    }));

    it('should handle error case for editBenOfferException with status code 401', () => {
      let index = 0;
      let exceptionId = 15;
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 401,
        error: { _error: { message: 'error', customMessage: 'error' } },
      });
      exceptionServiceSpy.editBenOfferException = jasmine
        .createSpy('editBenOfferException')
        .and.returnValue(throwError(error));
      component.onUpdate(index, exceptionId);
      expect(component.onUpdate).toBeDefined();
    });
    it('should handle error case for editBenOfferException with status code other than 401 and 403', () => {
      let index = 0;
      let exceptionId = 15;
      const error: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        error: { _error: { message: 'error', customMessage: 'error' } },
      });
      exceptionServiceSpy.editBenOfferException = jasmine
        .createSpy('editBenOfferException')
        .and.returnValue(throwError(error));
      component.onUpdate(index, exceptionId);
      expect(component.onUpdate).toBeDefined();
    });
    it('handleOriginationTypeChange', () => {
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.benOfferCloneExceptionsData = JSON.parse(
        JSON.stringify(TestData.planTypeExceptions)
      );
      component.originationValues = [
        {
          attributeValue: 'Sales',
          name: 'Sales',
        },
        {
          attributeValue: 'Acquisition',
          name: 'Acquisition',
        },
        {
          attributeValue: 'State Rule',
          name: 'State Rule',
        },
        {
          attributeValue: 'No TN Config',
          name: 'No TN Config',
        },
        {
          attributeValue: 'Others',
          name: 'Others',
        },
      ];
      component.handleOriginationTypeChange('Sales', 15, 0);
      expect(component.handleOriginationTypeChange).toBeDefined();
    });

    it('error case for handleOriginationTypeChange', () => {
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.originationValues = null;
      component.handleOriginationTypeChange('Sales', 15, 0);
      expect(component.handleOriginationTypeChange).toBeDefined();
    });

    it('handleOfferedTypeChange', () => {
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.offeredTypes = [
        {
          attributeValue: 'Offered',
          name: 'Offered',
        },
        {
          attributeValue: 'Not Offered',
          name: 'Not Offered',
        },
      ];
      component.handleOfferedTypeChange('Offered', 15, 0);
      expect(component.handleOfferedTypeChange).toBeDefined();
    });

    it('handleOfferedTypeChange set offeredBooleanValue to false', () => {
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.offeredTypes = [
        {
          attributeValue: 'Offered',
          name: 'Offered',
        },
        {
          attributeValue: 'Not Offered',
          name: 'Not Offered',
        },
      ];
      component.handleOfferedTypeChange('Not Offered', 15, 0);
      expect(component.handleOfferedTypeChange).toBeDefined();
    });

    it('handleOfferedTypeChange if offeredTypes or benOfferExceptionsData is null', () => {
      component.benOfferExceptionsData = null;
      component.offeredTypes = null;
      component.handleOfferedTypeChange('Offered', 15, 0);
      expect(component.handleOfferedTypeChange).toBeDefined();
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
    it('getOfferedValue - true', fakeAsync(() => {
      let offered = true;
      expect(component.getOfferedValue(offered)).toEqual(AppStringConstants.OFFERED);
    }));
    it('getPlanName - 10', fakeAsync(() => {
      component.planTypes = TestData.benOfferPlanTypes;
      expect(component.getPlanName('10')).toEqual('medical');
    }));
    it('getPlanName - 599', fakeAsync(() => {
      component.planTypes = TestData.benOfferPlanTypes;
      expect(component.getPlanName('599')).toEqual(AppStringConstants.UNKNOWN_PLANTYPE);
    }));
    it('getOfferedValue - true', fakeAsync(() => {
      let offered = true;
      expect(component.getOfferedValue(offered)).toEqual(AppStringConstants.OFFERED);
    }));
    it('getOfferedValue - false', fakeAsync(() => {
      let offered = false;
      expect(component.getOfferedValue(offered)).toEqual(AppStringConstants.NOT_OFFERED);
    }));
    it('enableSave - index - 0', fakeAsync(() => {
      let index = 0;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.enableSaveButton(index);
      expect(component.rowEditableList[index].saveButtonEditable).toEqual(true);
    }));
    it('disableSave - index - 1', fakeAsync(() => {
      let index = 1;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.disableSaveButton(index);
      expect(component.rowEditableList[index].saveButtonEditable).toEqual(false);
    }));
    it('onEditClick - edit check', fakeAsync(() => {
      let index = 0;
      let exceptionId = 15;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.onEditClick(index, exceptionId);
      fixture.detectChanges();
      expect(component.rowEditableList[index].editable).toEqual(false);
    }));
    it('onEditClick - refresh check', fakeAsync(() => {
      let index = 0;
      let exceptionId = 15;
      component.benOfferExceptionsData = TestData.planTypeExceptions;
      component.createRowEditableList();
      component.rowEditableList[index].editable = false;
      component.onEditClick(index, exceptionId);
      fixture.detectChanges();
      expect(component.rowEditableList[index].editable).toEqual(true);
      expect(exceptionServiceSpy.getBenOfferException.calls.count()).toBe(
        1,
        'getBenOfferException() for refreshed node called once'
      );
      expect(exceptionServiceSpy.getBenOfferException).toHaveBeenCalledWith(
        '001',
        '00001940564',
        exceptionId
      );
      tick();
      expect(component.benOfferExceptionsData.find(({ id }) => id === exceptionId)).toEqual(
        TestData.planTypeExceptions.find(({ id }) => id === exceptionId)
      );
    }));
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
    xit('should test getStartDate and getEndDate', async () => {
      const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
      let matInput: MatDatepickerInputHarness[];
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
      spyOnProperty(window, 'innerHeight', 'get').and.returnValue(1000);
      spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(250);
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
  }

  class Page {
    private fixture: ComponentFixture<PlantypeExceptionsComponent>;
    constructor(fixture: ComponentFixture<PlantypeExceptionsComponent>) {
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
    get startDateCalendarBox() {
      return this.elementById('exceptionStartDate0');
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
