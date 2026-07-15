import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { LifeDisabilityBandExceptionsComponent } from "./life-disability-band-exceptions.component";
import { BannerMessage } from 'src/app/models/bannerMessage';
import { ExcpetionService } from "src/app/services/excpetion.service";
import { CommonService } from "src/app/services/common.service";
import { AppModule } from "src/app/app.module";
import { AppStringConstants } from "src/app/constants/AppStringConstants";
import { asyncData, asyncError } from "../../testing/async-observable-helpers";
import { Component, Input } from "@angular/core";
import { of } from "rxjs";

const mockExceptionsData = [
  {
    id: 16,
    companyCode: "L13",
    companyName: "M Comp 1831 Vend Inc.",
    startDate: "2026-05-25",
    endDate: "2099-12-31",
    approverName: "Cynthea D Markarian",
    createTime: 1782970804653,
    assignedLifeBand: 1,
    overrideLifeBand: 2,
    assignedDisabilityBand: 1,
    overrideDisabilityBand: 2,
  },
  {
    id: 1001,
    companyCode: "Test",
    companyName: "Test Company",
    startDate: "2026-07-10",
    endDate: "2027-12-31",
    approverName: "Kathrine M Jett",
    createTime: 1782974995283,
    assignedLifeBand: 2,
    overrideLifeBand: 1,
    assignedDisabilityBand: 2,
    overrideDisabilityBand: 1,
  },
];

const mockExceptionAttributes = [
  {
    exceptionId: 2,
    attributes: [
      {
        attributeId: 2,
        values: [
          { attributeValue: "00002340287", name: "Cynthea D Markarian" },
          { attributeValue: "000123456", name: "Kathrine M Jett" },
        ],
      },
    ],
  },
];

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe("LifeDisabilityBandExceptionsComponent", () => {
  let component: LifeDisabilityBandExceptionsComponent;
  let fixture: ComponentFixture<LifeDisabilityBandExceptionsComponent>;
  let exceptionServiceSpy: any;
  let commonServiceSpy: any;

  class ExceptionServiceSpy {
    getAllExchanges = jasmine
      .createSpy("getAllExchanges")
      .and.callFake(() => asyncData([]));
    getAllLifeAndDisabilityOverrideExceptions = jasmine
      .createSpy("getAllLifeAndDisabilityOverrideExceptions")
      .and.callFake(() => asyncData(deepClone(mockExceptionsData)));
    getExceptionAttributes = jasmine
      .createSpy("getExceptionAttributes")
      .and.callFake(() => asyncData(deepClone(mockExceptionAttributes)));
    getAllCompanies = jasmine
      .createSpy("getAllCompanies")
      .and.callFake(() => asyncData([]));
    editException = jasmine
      .createSpy("editException")
      .and.callFake(() => asyncData(deepClone(mockExceptionsData)));
    getException = jasmine
      .createSpy("getException")
      .and.callFake(() => asyncData(deepClone(mockExceptionsData[0])));
  }

  class CommonServiceSpy {
    loadSession = jasmine
      .createSpy("loadSession")
      .and.returnValue(Promise.resolve({ message: "success" }));
    getCompanyId = jasmine.createSpy("getCompanyId").and.returnValue("001");
    getEmployeeId = jasmine
      .createSpy("getEmployeeId")
      .and.returnValue("00001234567");
    getBSSHost = jasmine
      .createSpy("getBSSHost")
      .and.returnValue("http://localhost/api/");
  }

  beforeEach(waitForAsync(() => {
    @Component({
      selector: "app-new-exception",
      template: "<div></div>",
    })
    class MockNewExceptionComponent {
      @Input() deselectionException: boolean;
      @Input() approvers: any;
      @Input() exceptions: any;
    }

    @Component({
      selector: "app-exception-filter",
      template: "<div></div>",
    })
    class MockExceptionFilterComponent {
      @Input() exceptionsData: any[];
      @Input() clearFlag: boolean;
    }

    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: CommonService, useClass: CommonServiceSpy },
        { provide: ExcpetionService, useValue: {} },
      ],
    })
      .overrideComponent(LifeDisabilityBandExceptionsComponent, {
        set: {
          providers: [
            { provide: ExcpetionService, useClass: ExceptionServiceSpy },
            { provide: CommonService, useClass: CommonServiceSpy },
          ],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(
          LifeDisabilityBandExceptionsComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
        exceptionServiceSpy =
          fixture.debugElement.injector.get(ExcpetionService);
        commonServiceSpy = fixture.debugElement.injector.get(CommonService);
      });
  }));
  beforeEach(fakeAsync(() => {
    fixture.detectChanges(); // Triggers ngOnInit()
    tick(); // Flush all pending async operations
    fixture.detectChanges(); // Re-detect changes with loaded data
    exceptionServiceSpy = fixture.debugElement.injector.get(ExcpetionService);
    commonServiceSpy = fixture.debugElement.injector.get(CommonService);
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with table headers", () => {
    expect(component.lifeBandTableHeaders).toBeDefined();
    expect(component.lifeBandTableHeaders.size).toBeGreaterThan(0);
  });

  it("should initialize approvers from exception attributes", () => {
    expect(component.approvers.length).toBe(2);
    expect(component.approvers[0].name).toBe("Cynthea D Markarian");
  });

  it("should load mock data on component initialization", waitForAsync(() => {
    fixture.detectChanges();
    expect(component.overrideData.length).toBeGreaterThan(0);
  }));

  it("should create rowEditableList", waitForAsync(() => {
    fixture.detectChanges();
    expect(component.rowEditableList.length).toBe(
      component.overrideData.length,
    );
  }));

  it("should initialize rowEditableList with editable property", waitForAsync(() => {
    fixture.detectChanges();
    component.rowEditableList.forEach((row) => {
      expect(row.editable).toBe(true);
      expect(row.saveButtonEditable).toBe(false);
    });
  }));

  it("should call handleLifeBandChange", waitForAsync(() => {
    fixture.detectChanges();
    component.handleLifeBandChange(3, 16, 0);
    expect(component.overrideData[0].assignedLifeBand).toBe(3);
  }));

  it("should call handleOverrideLifeBandChange", waitForAsync(() => {
    fixture.detectChanges();
    component.handleOverrideLifeBandChange(4, 16, 0);
    expect(component.overrideData[0].overrideLifeBand).toBe(4);
  }));

  it("should call handleDisabilityBandChange", waitForAsync(() => {
    fixture.detectChanges();
    component.handleDisabilityBandChange(3, 16, 0);
    expect(component.overrideData[0].assignedDisabilityBand).toBe(3);
  }));

  it("should call handleOverrideDisabilityBandChange", waitForAsync(() => {
    fixture.detectChanges();
    component.handleOverrideDisabilityBandChange(4, 16, 0);
    expect(component.overrideData[0].overrideDisabilityBand).toBe(4);
  }));

  it("should toggle edit mode on onEditClick", waitForAsync(() => {
    fixture.detectChanges();
    component.onEditClick(0, 16);
    expect(component.rowEditableList[0].editable).toBe(false);
  }));

it('should save changes on onUpdate', () => {
  component.bannerMessage = new BannerMessage('', '', false);
  component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
  component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
  component.createRowEditableList();
  component.rowEditableList[0].editable = false;
  component.rowEditableList[0].saveButtonEditable = true;

  spyOn(window, 'setTimeout').and.callFake(((callback: TimerHandler) => {
    if (typeof callback === 'function') {
      callback();
    }
    return 0 as any;
  }) as any);

  component.onUpdate(0, 16);
  fixture.detectChanges();

  expect(component.bannerMessage.bannerMessageType).toBe(AppStringConstants.TYPE_SUCCESS);
  expect(component.spinnerShow).toBe(false);
  expect(component.rowEditableList[0].editable).toBe(true);
  expect(component.rowEditableList[0].saveButtonEditable).toBe(false);
});

it('should not update on onUpdate when index is null or undefined', () => {
  component.bannerMessage = new BannerMessage('', '', false);
  component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
  component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
  component.createRowEditableList();
  component.spinnerShow = false;

  component.onUpdate(null, 16);
  component.onUpdate(undefined, 16);

  expect(component.spinnerShow).toBe(false);
  expect(component.rowEditableList[0].editable).toBe(true);
  expect(component.rowEditableList[0].saveButtonEditable).toBe(false);
});

  it("should scroll to top", () => {
    spyOn(window, "scrollTo");
    component.scrollTop();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("should sort data", () => {
    const data = JSON.parse(JSON.stringify(mockExceptionsData));
    const expectedOrder = JSON.parse(JSON.stringify(mockExceptionsData))
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      .map((item) => item.id);

    const result = component.sort(data, "createTime", "asc");

    expect(result.length).toBe(mockExceptionsData.length);
    expect(result.map((item) => item.id)).toEqual(expectedOrder);
  });

  it("should set selected quarter, exchange and company", () => {
    component.handleSelectedQuarterChange("Q1");
    component.handleSelectedExchangeChange("EXCH");
    component.handleSelectedCompanyChange("L13");

    expect(component.selectedQuarter).toBe("Q1");
    expect(component.filterExchangeValue).toBe("EXCH");
    expect(component.selectedCompanyCode).toBe("L13");
  });

  it("should set banner on handleNewExceptionBanner", () => {
    const banner = new BannerMessage("ok", AppStringConstants.TYPE_INFO, true);
    component.handleNewExceptionBanner(banner);
    expect(component.bannerMessage).toBe(banner);
  });

  it("should add new exception at first position and recreate editable rows", () => {
    const newException = {
      id: 9999,
      companyCode: "NEW",
      companyName: "New Co",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      approverName: "Approver",
      createTime: 1783000000000,
      assignedLifeBand: 1,
      overrideLifeBand: 1,
      assignedDisabilityBand: 1,
      overrideDisabilityBand: 1,
    };

    const previousLength = component.overrideData.length;
    component.addNewException(newException);

    expect(component.overrideData[0].id).toBe(9999);
    expect(component.overrideData.length).toBe(previousLength + 1);
    expect(component.rowEditableList.length).toBe(component.overrideData.length);
  });

  it("should not update start date when date input value is empty", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
    component.createRowEditableList();
    component.rowEditableList[0].saveButtonEditable = false;
    const previousStartDate = component.overrideData[0].startDate;

    component.getStartDate({ value: null } as any, 16, 0);

    expect(component.overrideData[0].startDate).toBe(previousStartDate);
    expect(component.rowEditableList[0].saveButtonEditable).toBe(false);
  });

  it("should not update end date when date input value is empty", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
    component.createRowEditableList();
    component.rowEditableList[0].saveButtonEditable = false;
    const previousEndDate = component.overrideData[0].endDate;

    component.getEndDate({ value: null } as any, 16, 0);

    expect(component.overrideData[0].endDate).toBe(previousEndDate);
    expect(component.rowEditableList[0].saveButtonEditable).toBe(false);
  });

  it("should update start date and enable save when row is modified", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
    component.createRowEditableList();

    component.getStartDate({ value: "2026-06-01" } as any, 16, 0);

    expect(component.overrideData[0].startDate).toBe("2026-06-01");
    expect(component.rowEditableList[0].saveButtonEditable).toBe(true);
  });

  it("should update end date and enable save when row is modified", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
    component.createRowEditableList();

    component.getEndDate({ value: "2099-11-30" } as any, 16, 0);

    expect(component.overrideData[0].endDate).toBe("2099-11-30");
    expect(component.rowEditableList[0].saveButtonEditable).toBe(true);
  });

  it("should return false when row is not modified", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));
    expect(component.checkRowModification(0)).toBe(false);
  });

  it("should return true when row is modified", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    component.overrideDataClone = JSON.parse(JSON.stringify(mockExceptionsData));

    const currentOverrideLifeBand = component.overrideData[0].overrideLifeBand;
    component.overrideData[0].overrideLifeBand =
      currentOverrideLifeBand === 4 ? 3 : 4;

    expect(component.checkRowModification(0)).toBe(true);
  });

  it("should handle onSort default branch when direction is empty", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));
    const sortSpy = spyOn(component, "sort").and.callThrough();

    component.onSort({ column: "", direction: "" } as any);

    expect(sortSpy).toHaveBeenCalled();
  });

  it("should handle onSort non-default branch", () => {
    component.overrideData = JSON.parse(JSON.stringify(mockExceptionsData));

    component.onSort({ column: "companyCode", direction: "asc" } as any);

    expect(component.overrideData[0].companyCode).toBe("L13");
  });

  it("should set scrollTopHover when exception table exists", () => {
    spyOn(document, "querySelector").and.returnValue({} as Element);
    component.scrollTopHover = false;

    component.onWindowScroll();

    expect(component.scrollTopHover).toBe(true);
  });

  it("should not set scrollTopHover when exception table does not exist", () => {
    spyOn(document, "querySelector").and.returnValue(null);
    component.scrollTopHover = false;

    component.onWindowScroll();

    expect(component.scrollTopHover).toBe(false);
  });

  describe("getAllExceptions", () => {
    it("should load exceptions", () => {
      const expectedExceptions = [
        deepClone(mockExceptionsData[0]),
        deepClone(mockExceptionsData[1]),
      ];

      exceptionServiceSpy.getAllLifeAndDisabilityOverrideExceptions.and.returnValue(
        of(expectedExceptions),
      );
      component.overrideData = [];
      component.rowEditableList = [];

      component.getAllExceptions();
      fixture.detectChanges();

      expect(exceptionServiceSpy.getAllLifeAndDisabilityOverrideExceptions).toHaveBeenCalled();
      expect(component.overrideData.length).toBe(expectedExceptions.length);
      expect(component.rowEditableList.length).toBe(component.overrideData.length);
    });

    it("should set error banner for 401/403 errors", fakeAsync(() => {
      const authError = {
        status: 401,
        error: {
          _error: { message: "Unauthorized" },
        },
      } as any;
      exceptionServiceSpy.getAllLifeAndDisabilityOverrideExceptions.and.returnValue(
        asyncError(authError),
      );

      component.getAllExceptions();
      tick();
      fixture.detectChanges();

      expect(component.bannerMessage.bannerMessageType).toBe(AppStringConstants.TYPE_ERROR);
      expect(component.bannerMessage.bannerMessageText).toBe("Unauthorized");
    }));

    it("should set error banner for non-auth errors", fakeAsync(() => {
      const customError = {
        status: 500,
        error: {
          customMessage: "Failed to load",
        },
      } as any;
      exceptionServiceSpy.getAllLifeAndDisabilityOverrideExceptions.and.returnValue(
        asyncError(customError),
      );

      component.getAllExceptions();
      tick();
      fixture.detectChanges();

      expect(component.bannerMessage.bannerMessageType).toBe(AppStringConstants.TYPE_ERROR);
      expect(component.bannerMessage.bannerMessageText).toBe("Failed to load");
    }));
  });

  describe("getExceptionAttributes", () => {
    it("should set error banner for 403 errors", fakeAsync(() => {
      const authError = {
        status: 403,
        error: {
          _error: { message: "Forbidden" },
        },
      } as any;
      exceptionServiceSpy.getExceptionAttributes.and.returnValue(
        asyncError(authError),
      );

      component.getExceptionAttributes();
      tick();
      fixture.detectChanges();

      expect(component.bannerMessage.bannerMessageType).toBe(AppStringConstants.TYPE_ERROR);
      expect(component.bannerMessage.bannerMessageText).toBe("Forbidden");
    }));

    it("should set error banner for non-auth errors", fakeAsync(() => {
      const customError = {
        status: 500,
        error: {
          customMessage: "Unable to fetch attributes",
        },
      } as any;
      exceptionServiceSpy.getExceptionAttributes.and.returnValue(
        asyncError(customError),
      );

      component.getExceptionAttributes();
      tick();
      fixture.detectChanges();

      expect(component.bannerMessage.bannerMessageType).toBe(AppStringConstants.TYPE_ERROR);
      expect(component.bannerMessage.bannerMessageText).toBe("Unable to fetch attributes");
    }));
  });

  describe("compare", () => {
    it("should compare values correctly", () => {
      expect(component.compare(1, 2)).toBe(-1);
      expect(component.compare(2, 1)).toBe(1);
      expect(component.compare(1, 1)).toBe(0);
    });
  });
});
