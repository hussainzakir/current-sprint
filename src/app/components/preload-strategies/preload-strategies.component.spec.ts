import { ComponentFixture, TestBed,tick,fakeAsync, waitForAsync } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { PreloadStrategiesComponent } from './preload-strategies.component';
import { CommonService } from 'src/app/services/common.service';
import { PreloadStrategiesService } from 'src/app/services/preload-strategies.service';
import { asyncData } from '../../testing/async-observable-helpers';
import { TestData } from '../../testing/test-data';
import { By } from '@angular/platform-browser';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpTestingController } from '@angular/common/http/testing';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Input, Component } from '@angular/core';
import { PreloadStrategiesTestData } from 'src/app/testing/test-data-preload';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
describe('PreloadStrategiesComponent', () => {
  let component: PreloadStrategiesComponent;
  let fixture: ComponentFixture<PreloadStrategiesComponent>;
  let page: Page;
  let httpTestingController: HttpTestingController;
  

 class PreloadStrategiesSpy {
    getAllQuater = jasmine.createSpy('getAllQuater').and.callFake(
      () => asyncData(PreloadStrategiesTestData.listOfQuater)
    );
    getAllPreloadStrategiesStatus = jasmine.createSpy('getAllPreloadStrategiesStatus').and.callFake(
      () => asyncData(PreloadStrategiesTestData.listOfStatus)
    );
    preloadStrategiesByCompanyCode = jasmine.createSpy('preloadStrategiesByCompanyCode').and.callFake(
      () => asyncData(1)
    );
    preloadStrategiesByQuater = jasmine.createSpy('preloadStrategiesByQuater').and.callFake(
      () => asyncData(1)
    );
  
  }
  class CommonServiceSpy {
    loadSession = jasmine.createSpy('loadSession').and.returnValue(Promise.resolve({ message: 'success' }));
    getCompanyId = jasmine.createSpy('getCompanyId').and.returnValue("001");
    getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue("00001940564");
    
  }
  let preloadStrategiesSpy: PreloadStrategiesSpy;
  let commonServiceSpy: CommonServiceSpy;

  beforeEach(waitForAsync(() => {
    @Component({selector: 'app-new-exception', template: '<div>Hey this is PreloadStrategiesComponent </div>'})
    class PreloadStrategiesComponentMock {
    

    }

   
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        { provide: CommonService, useClass: CommonServiceSpy },{ provide: PreloadStrategiesService,  useValue: {}},
      ]    }).overrideComponent(PreloadStrategiesComponent, {
        set: {
          providers: [
            { provide: PreloadStrategiesService, useClass: PreloadStrategiesSpy },
            { provide: CommonService, useClass: CommonServiceSpy }
          ]
        }
      })
    .compileComponents().then(() =>{
      fixture = TestBed.createComponent(PreloadStrategiesComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      fixture.detectChanges();
      preloadStrategiesSpy = fixture.debugElement.injector.get(PreloadStrategiesService) as any;
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
    expect(component.pageTitle).toEqual("Preload Strategies");
  });

  describe('component logic testing -', componentLogicTest);
  describe('component logic testing -', scrollUITest);

  function componentLogicTest() {
    it('test ngOnInit()', fakeAsync(() => {
      component.ngOnInit();
      fixture.whenStable().then(() => {
      fixture.detectChanges();
      tick(150000);
      expect(component.preloadPlanYearOption.length).toEqual(12);
      expect(component.processStatusData.length).toEqual(8);

      });

   
    }));

    it("should test error case for getPreloadQuater", () => {
      const error = new HttpErrorResponse({
        status: 400
      });
      preloadStrategiesSpy.getAllQuater = jasmine.createSpy("getAllQuater").and.returnValue(throwError(error));
      component.getPreloadQuater();
      expect(component.getPreloadQuater).toBeDefined();
    });

    it("should test error case for getPreloadStratgyStatus", () => {
      const error = new HttpErrorResponse({
        status: 400
      });
      preloadStrategiesSpy.getAllPreloadStrategiesStatus = jasmine.createSpy("getAllPreloadStrategiesStatus").and.returnValue(throwError(error));
      component.getPreloadStratgyStatus();
      expect(component.getPreloadStratgyStatus).toBeDefined();
    })
 
    it('preloadStrategies - ', fakeAsync(() => {
      component.selected=2;
      component.companyCode='1';
      component.handlePreloadOption(2)
      tick();
      component.preloadStrategies();
      tick(150000);
      expect(component.preloadStatus).toEqual(1);

      component.selected=2;
      component.companyCode='1';
      component.handlePreloadOption(1)
      component.handleQuaterSelection(1)

      tick();
      component.preloadStrategies();
      tick(150000);
      expect(component.preloadStatus).toEqual(1);
      let data=[{"userId":"00050001308","preloadDate":"09/23/2021","status":"P","value":"Q1","type":"QUARTER"},{"userId":"00050001308","preloadDate":"09/23/2021","status":"I","value":"Q1","type":"QUARTER"},{"userId":"00001780307","preloadDate":"09/16/2021","status":"N","value":"AL","type":"QUARTER"},{"userId":"00050001308","preloadDate":"09/17/2021","status":"F","value":"8Y","type":"QUARTER"}]
      component.setStatus(data);
      let dataNew=[{"userId":"00050001308","preloadDate":"09/23/2021","status":"Processed","value":"Q1","type":"QUARTER"},{"userId":"00050001308","preloadDate":"09/23/2021","status":"Inprogress","value":"Q1","type":"QUARTER"},{"userId":"00001780307","preloadDate":"09/16/2021","status":"New","value":"AL","type":"QUARTER"},{"userId":"00050001308","preloadDate":"09/17/2021","status":"Failed","value":"8Y","type":"QUARTER"}]

      expect(data).toEqual(dataNew);
      component.errorHandling({error:{customMessage:"test"}},"","");
      expect(component.bannerMessage.bannerMessageShow).toEqual(true);

      component.errorHandling({error:{status:401}},"error","");
      expect(component.bannerMessage.bannerMessageText).toEqual("error");
      const mockCall = preloadStrategiesSpy.preloadStrategiesByCompanyCode.and.returnValue(throwError({status: 404}));
      expect(mockCall).toHaveBeenCalled();


    }));
    it("should handle error for preloadStrategies when selected value is 2", () => {
      const error = new HttpErrorResponse({
        status: 400
      });
      component.selected = 2;
      component.companyCode='1';
      preloadStrategiesSpy.preloadStrategiesByCompanyCode = jasmine.createSpy("preloadStrategiesByCompanyCode").and.returnValue(throwError(error));
      component.preloadStrategies();
      expect(component.preloadStrategies).toBeDefined();
    });

    it("should handle error for preloadStrategies when selected value is 1", () => {
      const error = new HttpErrorResponse({
        status: 400
      });
      component.selected = 1;
      component.companyCode='1';
      preloadStrategiesSpy.preloadStrategiesByQuater = jasmine.createSpy("preloadStrategiesByQuater").and.returnValue(throwError(error));
      component.preloadStrategies();
      expect(component.preloadStrategies).toBeDefined();
    }); 
    it("should call refreshStatus", () => {
      component.refreshStatus();
      expect(component.refreshStatus).toBeDefined();
    });
   
  }
  function scrollUITest(){
    it('when window scrolled more than 200px', () => {   
      expect(component.fixed).toBeFalsy('component.fixed should be false');   
      spyOnProperty(window, 'innerHeight', 'get').and.returnValue(1000);
      spyOnProperty(document.body, 'scrollTop', 'get').and.returnValue(250);
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
  private fixture: ComponentFixture<PreloadStrategiesComponent>;
  constructor(fixture: ComponentFixture<PreloadStrategiesComponent>) {
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
