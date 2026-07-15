import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { AppModule } from "src/app/app.module";
import { asyncData } from "../../testing/async-observable-helpers";
import { By } from "@angular/platform-browser";
import { Input, Component } from "@angular/core";
import { CommonService } from "src/app/services/common.service";
import { NewCompanyHqOverridesComponent } from "./new-company-hq-overrides.component";
import { HqOverrideTestData } from "src/app/testing/hq-override";
import { CompanyHqOverridesService } from "src/app/services/company-hq-overrides.service";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

describe("NewCompanyHqOverridesComponent", () => {
  let component: NewCompanyHqOverridesComponent;
  let fixture: ComponentFixture<NewCompanyHqOverridesComponent>;
  let page: Page;
  class CompanyHqOverridesServiceSpy {
    getCompanyHqOverrideDetail = jasmine
      .createSpy("getCompanyHqOverrideDetail")
      .and.callFake(() => asyncData(HqOverrideTestData.hqOverrideData[0]));
    createCompanyHqOverrideDetail = jasmine
      .createSpy("createCompanyHqOverrideDetail")
      .and.callFake(() => asyncData(HqOverrideTestData.hqOverrideData[0]));
    getCompanyData = jasmine
      .createSpy("getCompanyData")
      .and.callFake(() => asyncData(HqOverrideTestData.companyData));

    getCompanyData1 = jasmine
      .createSpy("getCompanyData")
      .and.callFake(() => asyncData([]));
  }
  class CommonServiceSpy {
    getCompanyId = jasmine.createSpy("getCompanyId").and.returnValue("001");
    getEmployeeId = jasmine
      .createSpy("getEmployeeId")
      .and.returnValue("00001940564");
    loadSession = jasmine
      .createSpy("loadSession")
      .and.returnValue(Promise.resolve({ message: "success" }));
  }
  let exceptionServiceSpy: CompanyHqOverridesServiceSpy;
  let commonServiceSpy: CommonServiceSpy;
  beforeEach(async(() => {
    @Component({
      selector: "app-combobox",
      template: "<div>Hey this is combo box </div>",
    })
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
        { provide: CompanyHqOverridesService, useValue: {} },
        { provide: CommonService, useClass: CommonServiceSpy },
      ],
    })
      .overrideComponent(NewCompanyHqOverridesComponent, {
        set: {
          providers: [
            {
              provide: CompanyHqOverridesService,
              useClass: CompanyHqOverridesServiceSpy,
            },
            { provide: CommonService, useClass: CommonServiceSpy },
          ],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NewCompanyHqOverridesComponent);
        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
        exceptionServiceSpy = fixture.debugElement.injector.get(
          CompanyHqOverridesService
        ) as any;
        commonServiceSpy = fixture.debugElement.injector.get(
          CommonService
        ) as any;
        if (typeof Array.prototype.find !== "function") {
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
  }));
  /**  beforeEach(() => {
    fixture = TestBed.createComponent(NewExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });*/
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should handleStateData test", () => {
    component.validateButton()
    expect(component.createButtonDisable).toEqual(false);

    component.stateAndZips=[{realmYearId:12,state:'?A',zipe:1222},{realmYearId:11,state:'B',zipe:'1222'}]
    component.newHqOverride.overrideHqState='a'
    component.newHqOverride.overrideHqZip='233'
    component.newHqOverride.state='a'
    component.validateButton()
    expect(component.createButtonDisable).toEqual(true);

    component.handleStateData("A")
    expect(component.newHqOverride.overrideHqState).toEqual("A");

    component.stateAndZips=[{realmYearId:12,state:'A',zipe:1222},{realmYearId:11,state:'B',zipe:'1222'}]
    component.handlePlanTypeValue(12,true)
    expect( component.newHqOverride.realmYearId).toEqual(12);

    component.stateAndZips=[{realmYearId:12,state:null,zipe:1222},{realmYearId:11,state:'B',zipe:'1222'}]
    component.handlePlanTypeValue(12,true)
    expect( component.newHqOverride.realmYearId).toEqual(12);

  });

  it("onCreateClick ", fakeAsync(() => {
    component.newHqOverride = HqOverrideTestData.hqOverrideData[0];
    component.onCreate();
    expect(
      exceptionServiceSpy.createCompanyHqOverrideDetail.calls.count()
    ).toBe(1, "createCompanyHqOverrideDetail()  called once");
    //expect(exceptionServiceSpy.createCompanyHqOverrideDetail).toHaveBeenCalledWith(HqOverrideTestData.hqOverrideData[0],HqOverrideTestData.hqOverrideData[0]);
    tick();
    //expect(component.newException).toEqual(TestData.newException);
  }));

  it("on Getting company code - correct company code", fakeAsync(() => {
    component.newHqOverride = HqOverrideTestData.hqOverrideData[0];
    component.getCompany();
    tick(1500);
    
    expect(component.newHqOverride.companyName).toEqual(
      "N Comp 4008 Vend Inc."
    );
    component.setError({status:40,message:'test'})
    expect( component.isCompanyValid).toEqual(false);

    component.onCreate();
    component.hqOverrideData=HqOverrideTestData.hqOverrideData

    component.setError({status:404})
    expect( component.isCompanyValid).toEqual(false);
    component.newHqOverride = HqOverrideTestData.hqOverrideData[4];
    component.getCompany();
    tick(1500);
    expect( component.isCompanyValid).toEqual(false);

    component.setCompanyData(HqOverrideTestData.companyData)
    expect(component.newHqOverride.companyCode).toEqual('001')

  }));
  it("should getCompanyData error ", () => {
    component.hqOverrideData=HqOverrideTestData.hqOverrideData

    component.newHqOverride = HqOverrideTestData.hqOverrideData[0];

    const error: HttpErrorResponse = new HttpErrorResponse({status: 401, error:{_error:{message: "error"}, customMessage: "error"}});
    exceptionServiceSpy.getCompanyData = jasmine.createSpy("getCompanyData").and.returnValue(throwError(error));
    component.getCompany()
    expect( component.isCompanyValid).toEqual(false);


  });

  it("should getCompanyData empty data", () => {
    component.hqOverrideData=HqOverrideTestData.companyData
    component.newHqOverride = HqOverrideTestData.hqOverrideData[0];

    exceptionServiceSpy.getCompanyData = jasmine
    .createSpy("getCompanyData")
    .and.callFake(() => asyncData([]));

    component.getCompany()

    expect( component.isCompanyValid).toEqual(true);

  });
  it("should getCompanyData invalid company data", () => {
    component.hqOverrideData=HqOverrideTestData.hqOverrideData
    component.newHqOverride = HqOverrideTestData.hqOverrideData[0];

    exceptionServiceSpy.getCompanyData = jasmine
    .createSpy("getCompanyData")
    .and.callFake(() => asyncData([]));

    component.getCompany()

    expect( component.isCompanyValid).toEqual(true);

  });
   
  class Page {
    private fixture: ComponentFixture<NewCompanyHqOverridesComponent>;
    constructor(fixture: ComponentFixture<NewCompanyHqOverridesComponent>) {
      this.fixture = fixture;
    }

    get scrollTopIcon() {
      return this.nativeElementCssSelector<HTMLElement>(".icon-icon_backtotop")
        ? this.nativeElementCssSelector<HTMLElement>(".icon-icon_backtotop")
        : this.nativeElementCssSelector<HTMLElement>(
            ".icon-icon_backtotop_hover"
          );
    }
    get typeaheadSearchBox() {
      return this.nativeElementCssSelector<HTMLElement>(".searchBox");
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
