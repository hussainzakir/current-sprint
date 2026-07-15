import { async, ComponentFixture, TestBed,tick,fakeAsync } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/services/common.service';
 import { asyncData } from '../../testing/async-observable-helpers';
import { By } from '@angular/platform-browser';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Input, Component } from '@angular/core';
import { PreloadStrategiesTestData } from '../../testing/test-data-preload';
import { throwError } from 'rxjs';
import { CompanyHqOverridesComponent } from './company-hq-overrides.component';
import { CompanyHqOverridesService } from 'src/app/services/company-hq-overrides.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';
import { ExcpetionService } from '../../services/excpetion.service';
import { HqOverrideTestData } from '../../testing/hq-override';
describe('CompanyHqOverridesComponent', () => {
  let component: CompanyHqOverridesComponent;
  let fixture: ComponentFixture<CompanyHqOverridesComponent>;
  let page: Page;
  let httpTestingController: HttpTestingController;
  
class ExcpetionServiceSpy {
  getAllExchanges  = jasmine.createSpy('getAllExchanges').and.callFake(
    () => asyncData(PreloadStrategiesTestData.listOfQuater)
  );
}
 class CompanyHqOverridesServiceSpy {
  getCompanyHqOverrideDetail = jasmine.createSpy('getCompanyHqOverrideDetail').and.callFake(
      () => asyncData(HqOverrideTestData.hqOverrideData)
    );
    createCompanyHqOverrideDetail = jasmine.createSpy('createCompanyHqOverrideDetail').and.callFake(
      () => asyncData(HqOverrideTestData.hqOverrideData[0])
    );
    getCompanyData = jasmine.createSpy('getCompanyData').and.callFake(
      () => asyncData(HqOverrideTestData.hqOverrideData[0])
    );
    deleteHq = jasmine.createSpy('deleteHq').and.callFake(
      () => asyncData({})
    );
  }
  class CommonServiceSpy {
    loadSession = jasmine.createSpy('loadSession').and.returnValue(Promise.resolve({ message: 'success' }));
    getCompanyId = jasmine.createSpy('getCompanyId').and.returnValue("001");
    getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue("00001940564");
    
  }
  let preloadStrategiesSpy: CompanyHqOverridesServiceSpy;
  let commonServiceSpy: CommonServiceSpy;

  beforeEach(async(() => {
    @Component({selector: 'app-new-company-hq-overrides', template: '<div>Hey this is PreloadStrategiesComponent </div>'})
    class PreloadStrategiesComponentMock {
    

    }

   
    TestBed.configureTestingModule({
      imports: [AppModule,
        HttpClientTestingModule,
        CookieModule.forRoot()],
      providers: [
        { provide: CommonService, useClass: CommonServiceSpy },
        { provide: CompanyHqOverridesService,  useValue: {}},
        { provide: ExcpetionService,  useValue: {}}
      ]    }).overrideComponent(CompanyHqOverridesComponent, {
        set: {
          providers: [
            { provide: CompanyHqOverridesService, useClass: CompanyHqOverridesServiceSpy },
            { provide: ExcpetionService, useClass:ExcpetionServiceSpy },
            { provide: CommonService, useClass: CommonServiceSpy }
          ]
        }
      })
    .compileComponents().then(() =>{
      fixture = TestBed.createComponent(CompanyHqOverridesComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      fixture.detectChanges();
      preloadStrategiesSpy = fixture.debugElement.injector.get(CompanyHqOverridesService) as any;
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
  afterEach(() => {
    fixture.destroy();
    component = null;
  });
  it('should handleStateData test', () => {
    component.handleStateData('test',0)
    expect(component.newHqOverride).toEqual("test");
  });
  it("should deleteHq", fakeAsync(() => {
    component.spinnerShow=false;
    component.deleteHq('test')
    tick(150000);
    expect(component.spinnerShow).toEqual(false);
  }));
 
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.pageTitle).toEqual(AppStringConstants.HQ_OVERRIDE_EXCEPTIONS_TITLE);
  });
  it('should enableSaveButton test', () => {
    component.rowEditableList=HqOverrideTestData.hqOverrideData
    component.enableSaveButton(0)
    expect(component.rowEditableList[0].saveButtonEditable).toEqual(true);
  });
  it('should disableSaveButton test', () => {
    component.rowEditableList=HqOverrideTestData.hqOverrideData
    component.disableSaveButton(0)
    expect(component.rowEditableList[0].saveButtonEditable).toEqual(false);
  });
  it('should handleSelectedQuarterChange', () => {
    component.handleSelectedQuarterChange("Q1")
    expect(component.selectedQuarter="Q1");

    component.handleSelectedQuarterChange(null)
    expect(component.selectedQuarter=null);
  });
  it('should getAttributeName', () => {
    let result=component.getAttributeName(HqOverrideTestData.hqOverrideData,'companyCode')
    expect(result="companyCode");
  });
  
  it('createRowEditableList - planTypes list ', fakeAsync(() => {
    component.rowEditableList = [];
    component.hqOverrideAttributes = [{canEdit:true},{canEdit:true}];
    let j = 2;
    component.getAllHqOverride();
    tick(150000);
    component.hqOverrideAttributes[0].canEdit=true
    component.hqOverrideAttributes[1].canEdit=true
    expect(component.bannerMessage.bannerMessageShow).toEqual(false);
    component.onEditClick(1,HqOverrideTestData.hqOverrideData[1]);
    tick(150000);
    expect(component.bannerMessage.bannerMessageShow).toEqual(false);
    component.onEditClick(1,HqOverrideTestData.hqOverrideData[0]);
    tick(150000);
    //expect(component.bannerMessage.bannerMessageShow).toEqual(false);
    component.onUpdate(HqOverrideTestData.hqOverrideData[1],1);
    expect(component.rowEditableList[1].editable).toEqual(true);
    component.onClone(HqOverrideTestData.hqOverrideData[1],1);
    tick(1500);
    expect(component.bannerMessage.bannerMessageShow).toEqual(true);
    component.handleDeleteClick(HqOverrideTestData.hqOverrideData[1],1);
    tick(150000);
    expect(component.bannerMessage.bannerMessageShow).toEqual(false);
    component.handleSelectedCompanyChange('S4U')

    expect(component.companyCode).toEqual('S4U');
    let result=[]
    result=component.sort(HqOverrideTestData.hqOverrideData,'coll','acc')
    expect(result.length).toEqual(5);

   // expect(component.sort(HqOverrideTestData.hqOverrideData,'coll','acc')).toEqual("")
    component.sort(HqOverrideTestData.hqOverrideData,'coll','')
    expect(result.length).toEqual(5);

    component.addNewException(HqOverrideTestData.hqOverrideData[0])

    component.closeBanner("1")
    tick(15000);
    expect(component.bannerMessage.bannerMessageShow).toEqual(false);

  })
  );
  describe('component scrollUITest testing -', scrollUITest);


  describe('component logic testing -', componentLogicTest);
 // describe('component logic testing -', scrollUITest);

  function componentLogicTest() {
    it('test ngOnInit()', fakeAsync(() => {
      component.ngOnInit();
      fixture.whenStable().then(() => {
      fixture.detectChanges();
      tick(150000);
      expect(component.hqOverrideAttributes.length).toEqual(HqOverrideTestData.hqOverrideData.length, 'getCompanyHqOverrideDetail should have '+HqOverrideTestData.hqOverrideData.length+' exchanges returned');
      component.getAllHqOverride()
      tick(150000);

      expect(component.hqOverrideAttributes.length).toEqual(HqOverrideTestData.hqOverrideData.length, 'getCompanyHqOverrideDetail should have '+HqOverrideTestData.hqOverrideData.length+' exchanges returned');
      let b={bannerMessageText:'test',bannerMessageShow:true,bannerMessageType:'INFO'};
      component.handleNewExceptionBanner(b);
      tick(150000);

      expect(component.hqOverrideAttributes.length).toEqual(HqOverrideTestData.hqOverrideData.length, 'getCompanyHqOverrideDetail should have '+HqOverrideTestData.hqOverrideData.length+' exchanges returned');
      expect(component.rowEditableList[2].saveButtonEditable).toEqual(false);

      });
      
      
    })); 
   
  
   
  }
  function scrollUITest(){
    it('when window scrolled more than 200px', () => {   
      expect(component.fixed).toBeFalsy('component.fixed should be false');   
      window.scrollTo(0, 220);
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
  private fixture: ComponentFixture<CompanyHqOverridesComponent>;
  constructor(fixture: ComponentFixture<CompanyHqOverridesComponent>) {
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
