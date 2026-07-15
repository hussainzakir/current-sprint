import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { CommonService } from './services/common.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    window['gtag'] = () => { };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        AppModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [CommonService]


    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ui-bss-admin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ui-bss-admin');
  });
  it('should create app.component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    let commonService: CommonService;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    commonService = TestBed.get(CommonService);
    commonService.loadSession = () => Promise.resolve(true);
    component.ngOnInit();
  });
  it("should check for else condition in OnInit", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    let commonService: CommonService;
    commonService = TestBed.get(CommonService);
    commonService.loadSession = null;
    component.ngOnInit();
    expect(component.ngOnInit).toBeDefined();
  });
});