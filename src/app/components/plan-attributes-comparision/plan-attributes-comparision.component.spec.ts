import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieModule, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { CommonService } from 'src/app/services/common.service';
import { PlanAttributesService } from 'src/app/services/plan-attributes.service';
import { asyncError } from 'src/app/testing/async-observable-helpers';
import { PlanComparsionTestData } from 'src/app/testing/test-data-plan-comparsion';
import { PlanAttributesComparisionComponent } from './plan-attributes-comparision.component';


describe('PlanAttributesComparisionComponent', () => {
  let component: PlanAttributesComparisionComponent;
  let service: PlanAttributesService;
  let serviceSpy: PlanAttributesService;
  let commonservice: CommonService;
  let cookieServiceSpy: any;
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy };
  const loggedinEmpId = "00001940564";
  const loggedInCompanyCode = "001";
  const mockMapPlans: any = PlanComparsionTestData.MAPPED_PLANS;
  const currentYearPlans: any = PlanComparsionTestData.CURRENT_YEAR_OR_ALL_PLANS;
  let fixture: ComponentFixture<PlanAttributesComparisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanAttributesComparisionComponent],
      imports: [
        HttpClientTestingModule,
        AppModule,
        CookieModule.forRoot()],
      providers: [PlanAttributesService, CommonService, CookieService, CookieOptionsProvider],
    })
      .compileComponents();
  });

  beforeEach(() => {
    window['gtag'] = () => { };
    serviceSpy = TestBed.inject(PlanAttributesService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    cookieServiceSpy = jasmine.createSpyObj("CookieService", ['set', 'get']);
    commonservice = new CommonService(<any>httpClientSpy, cookieServiceSpy);
    service = new PlanAttributesService(<any>httpClientSpy, commonservice);
    fixture = TestBed.createComponent(PlanAttributesComparisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('searchCompany, Success', () => {
    const event = { target: { value: "SSO" } };
    const getCompanySpy1 = spyOn(serviceSpy, 'getCompanyName').and
      .returnValue(of(PlanComparsionTestData.COMPANY_NAME_RESPONSE));
    component.searchCompany(event);
    expect(getCompanySpy1).toHaveBeenCalled();
  });

  it('searchCompany, Success else', () => {
    const event = { target: { value: 'G48' } };
    const mockComapany = { data: { exchange: 'TriNet III' } };
    const getCompanySpy = spyOn(serviceSpy, 'getCompanyName').and.returnValue(of(mockComapany));
    component.searchCompany(event);
    expect(getCompanySpy).toHaveBeenCalled();
  });

  it('searchCompany, failure', () => {
    const event = { target: { value: "" } };
    component.companyError = '';
    component.searchCompany(event);
    expect(component.companyError).toEqual('');
  });

  it('searchCompany, failure', () => {
    const event = { target: { value: null } };
    component.companyError = '';
    component.searchCompany(event);
    expect(component.companyError).toEqual('');
  });

  it('searchCompany, failure response', () => {
    const event = { target: { value: 'sso' } };
    const planSpy = spyOn(serviceSpy, 'getCompanyName').and.returnValue(asyncError('error'));
    component.searchCompany(event);
    expect(planSpy).toHaveBeenCalled();
  });

  it('getAllAvailablePlans, success',()=>{
    const paramData = {
      companyCode: '001',
      loggedinEmpId: '00001940564',
      loggedInCompanyCode: '001'
    };
    const currentOrAllPlans = JSON.stringify(PlanComparsionTestData.CURRENT_YEAR_OR_ALL_PLANS);
    const mapPlans = JSON.stringify(PlanComparsionTestData.MAPPED_PLANS);
    const respObj = {
      currentYearPlans: JSON.parse(currentOrAllPlans),
      mappedPlans: JSON.parse(mapPlans),
      futureYearPlans: JSON.parse(currentOrAllPlans)
    };
    const allPlansSpy = spyOn(serviceSpy,"getAllPlans").and.returnValue(of(respObj));
    component.loggedInCompanyCode = loggedInCompanyCode;
    component.loggedinEmpId = loggedinEmpId;
    component.getAllAvailablePlans('001');
    expect(allPlansSpy).toHaveBeenCalledWith(paramData);
    expect(component.currentYearPlans).toEqual(JSON.parse(currentOrAllPlans).data);
  });

  it('getPlanLimitCount, success',()=>{
    const paramData = {
      companyCode: '001',
      loggedinEmpId: '00001940564',
      loggedInCompanyCode: '001'
    };
    const planCountSpy = spyOn(serviceSpy,"getPlanLimitCount").and.returnValue(of({PLAN_COMPARE_LIMIT_COUNT:'50'}));
    component.loggedInCompanyCode = loggedInCompanyCode;
    component.loggedinEmpId = loggedinEmpId;
    component.getPlanLimitCount(paramData);
    expect(planCountSpy).toHaveBeenCalledWith(paramData);
  });

  it('getPlanLimitCount, failure',()=>{
    const paramData = {
      companyCode: '001',
      loggedinEmpId: '00001940564',
      loggedInCompanyCode: '001'
    };
    const planCountSpy = spyOn(serviceSpy,"getPlanLimitCount").and.returnValue(asyncError('error'));
    component.loggedInCompanyCode = loggedInCompanyCode;
    component.loggedinEmpId = loggedinEmpId;
    component.getPlanLimitCount(paramData);
    expect(planCountSpy).toHaveBeenCalledWith(paramData);
  });

  it('totalPlanCount, Success', () => {
    const planFormData = JSON.stringify(PlanComparsionTestData.PLAN_SELECTION_FORM);
    let rowDataObj = JSON.parse(planFormData);
    component.currentPlansControl.setValue({planId:'123'});
    component.rowData = [rowDataObj];
    expect(component.totalPlanCount(-1)).toEqual(6);
  });

  it('onFilterPlans, Success if', () => {
    const events = { target: { value: 'IN' } }
    const planName = 'current-plan';
    component.currentYearPlans = currentYearPlans.data;
    component.onFilterPlans(events, planName);
    expect(component.currentYearPlans).toEqual(currentYearPlans.data);
  });

  it('onFilterPlans, Success else if', () => {
    const events = { target: { value: 'Ae' } }
    const planName = 'mapped-plan';
    component.filteredMappedPlansCopy = mockMapPlans.data;
    component.onFilterPlans(events, planName);
    expect(component.filteredMappedPlans).toEqual(mockMapPlans.data);
  });

  it('onFilterPlans, Success else', () => {
    const events = { target: { value: 'ae' } }
    const planName = 'all-plan';
    component.filteredAllPlansCopy = currentYearPlans.data;
    component.onFilterPlans(events, planName);
    expect(component.filteredAllPlans).toEqual(currentYearPlans.data);
  });

  it('clear, Success if', () => {
    const planName = 'current-year-plan';
    component.currentYearPlans = [];
    component.clear(planName);
    expect(component.clear(planName)).toBeUndefined();
  });

  it('clear, Success else if',()=>{
    component.clear('mapped-plan');
    expect(component.mappedPlansControl.value.length).toBe(0);
  });

  it('clear, Success else',()=>{
    component.filteredAllPlansCopy = [];
    component.clear('all-plan');
    expect(component.allPlansControl.value.length).toBe(0);
    expect(component.filteredAllPlans.length).toBe(0);
  });

  it('onCurrentPlanSelection',()=>{
    component.mappedPlans = mockMapPlans.data;
    component.planSelectionForm.controls['currentPlan'].setValue(currentYearPlans.data[0]);
    component.allFuturePlans = currentYearPlans.data;
    component.onCurrentPlanSelection();
    expect(component.filteredMappedPlans.length).toBe(0);
  });

  it('onAddToCompare, if',()=>{
    component.planSelectionForm.setValue(PlanComparsionTestData.PLAN_SELECTION_FORM);
    component.rowData = [];
    component.onAddToCompare();
    expect(component.rowData.length).toBe(1);
  });

  it('onAddToCompare, else if',()=>{
    const planFormData = JSON.stringify(PlanComparsionTestData.PLAN_SELECTION_FORM);
    let rowDataObj = JSON.parse(planFormData);
    rowDataObj.mappedPlans = [];
    rowDataObj.allPlans[0].planId = "0012SFY";
    component.planSelectionForm.setValue(JSON.parse(planFormData));
    component.rowData = [rowDataObj];
    component.onAddToCompare();
    expect(component.onShowDefault).toBeFalsy();
    expect(component.rowData[0].mappedPlans.length).toBe(2);
    expect(component.rowData[0].allPlans.length).toBe(3);
  });

  it('onAddToCompare, else else if',()=>{
    const planFormData = JSON.stringify(PlanComparsionTestData.PLAN_SELECTION_FORM);
    let rowDataObj = JSON.parse(planFormData);
    rowDataObj.currentPlan.planId = "00123DE";
    component.planSelectionForm.setValue(JSON.parse(planFormData));
    component.rowData = [rowDataObj];
    component.onAddToCompare();
    expect(component.rowData.length).toBe(2);
  });

  it('expandAllRows, if', () => {
    component.expandAllToggle = true;
    component.rowData = [{ showDetail: false }];
    component.expandAllRows();
    expect(component.rowData[0].showDetail).toBeTruthy();
    expect(component.expandAllToggle).toBeFalsy();
  });

  it('expandAllRows, else', () => {
    component.expandAllToggle = false;
    component.rowData = [{ showDetail: false }];
    component.expandAllRows();
    expect(component.expandAllToggle).toBeTruthy();
  });

  it('removeRow, Call',()=>{
    component.rowData = [JSON.parse(JSON.stringify(PlanComparsionTestData.PLAN_SELECTION_FORM))];
    component.removeRow('002FFE');
    expect(component.rowData.length).toBe(0);
  });

  it('onAllPlanSelection, call', () => {
    const data = { planId: '1234' };
    component.onAllPlanSelection(data);
    expect(component.allPlansControl.value).toEqual([data]);
  });

  it('onMappedPlanSelection, call', () => {
    const data = { planId: '1234' };
    component.onMappedPlanSelection(data);
    expect(component.mappedPlansControl.value).toEqual([data]);
  });

  it('onMappedPlanOpen and onAllPlanOpen, call', () => {
    component.filteredMappedPlansCopy = PlanComparsionTestData.MAPPED_PLANS.data;
    component.filteredAllPlansCopy = PlanComparsionTestData.CURRENT_YEAR_OR_ALL_PLANS.data;
    component.onMappedPlanOpen();
    component.onAllPlanOpen();
    expect(component.filteredMappedPlans).toEqual(PlanComparsionTestData.MAPPED_PLANS.data);
    expect(component.filteredAllPlans).toEqual(PlanComparsionTestData.CURRENT_YEAR_OR_ALL_PLANS.data);
  });

  it('changeToArrayFormat, call',()=>{
    const data = [{planName:'Aetna'}];
    expect(component.changeToArrayFormat(data).length).toBe(1);
  });

  it('exportAsExcel, success',()=>{
    component.companyId.setValue('001');
    component.loggedInCompanyCode = loggedInCompanyCode;
    component.loggedinEmpId = loggedinEmpId;
    component.rowData = [PlanComparsionTestData.PLAN_SELECTION_FORM];
    const excelSpy = spyOn(serviceSpy,"exportAsExcel").and.returnValue(of(new HttpResponse()));
    component.exportAsExcel();
    expect(excelSpy).toHaveBeenCalled();
  });

  it('exportAsExcel, failure', () => {
    component.companyId.setValue('001');
    component.loggedInCompanyCode = loggedInCompanyCode;
    component.loggedinEmpId = loggedinEmpId;
    component.rowData = [PlanComparsionTestData.PLAN_SELECTION_FORM];
    const excelSpy = spyOn(serviceSpy, "exportAsExcel").and.returnValue(asyncError('error'));
    component.exportAsExcel();
    expect(excelSpy).toHaveBeenCalled();
  });

  it('checkExpandAll, call', () => {
    component.rowData = [{ showDetail: false }];
    component.checkExpandAll();
    expect(component.expandAllToggle).toBeTruthy();
  });

});
