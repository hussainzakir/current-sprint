import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { CommonService } from 'src/app/services/common.service';
import { PlanAttributesService } from 'src/app/services/plan-attributes.service';
import { saveAs } from 'file-saver';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { BannerMessage } from 'src/app/models/bannerMessage';

@Component({
  selector: 'app-plan-attributes-comparision',
  templateUrl: './plan-attributes-comparision.component.html',
  styleUrls: ['./plan-attributes-comparision.component.scss']
})
export class PlanAttributesComparisionComponent implements OnInit {
  filteredCurrentPlans: any[];
  filteredMappedPlans: any[];
  filteredMappedPlansCopy: any[];
  filteredAllPlans: any[];
  filteredAllPlansCopy: any[];
  pageTitle: any = AppStringConstants.PLAN_ATTRIBUTES_COMPARISION_TITLE;
  showCompanyError = false;
  companyError: string;
  form!: FormGroup;
  planSelectionForm!: FormGroup;
  companyName: string;
  currentYearPlans: any[];
  mappedPlans: any[];
  allFuturePlans: any[];
  loggedinEmpId: string;
  loggedInCompanyCode: string;
  rowData = [];
  addToCompareDisabled = true;
  onShowDefault = true;
  planCount: number;
  showSpinner = false;
  planCompareCount = 50;
  expandAllToggle = true;
  bannerMessage: BannerMessage;
  allPlanSelection = new SelectionModel<any>(true, []);
  mappedPlanSelection = new SelectionModel<any>(true, []);
  @ViewChild('matRefMapped') matRefMapped: MatSelect;
  @ViewChild('matRefAll') matRefAll: MatSelect;

  get companyId() {
    return this.form.controls['companyId'] as FormControl;
  }

  get currentPlansControl() {
    return this.planSelectionForm.controls['currentPlan'] as FormControl;
  }

  get mappedPlansControl() {
    return this.planSelectionForm.controls['mappedPlans'] as FormControl;
  }

  get allPlansControl() {
    return this.planSelectionForm.controls['allPlans'] as FormControl;
  }

  headerValues = ['Current Plan', 'Mapped Plan', 'All Plan', 'Action'];

  constructor(private fb: FormBuilder,
    private planAttributeService: PlanAttributesService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private commonService: CommonService) {
    this.form = this.createForm();
    this.planSelectionForm = this.creatPlanSelectionForm();
  }

  ngOnInit(): void {
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.bannerMessage = new BannerMessage('', '', false);
  }

  creatPlanSelectionForm() {
    return this.fb.group({
      currentPlan: [{}],
      mappedPlans: [[]],
      allPlans: [[]]
    });
  }

  searchCompany(event: any) {
    const val = event.target.value?.toUpperCase();
    this.resetData();
    if (val) {
      this.showSpinner = true;
      this.planAttributeService.getCompanyName(val, this.loggedInCompanyCode).subscribe(company => {
        this.companyName = company?.data?.company?.name;
        this.getAllAvailablePlans(val);
      }, _error => {
        this.onFailResponse();
      });
    } else if (val === '') {
      this.companyError = '';
      this.showCompanyError = false;
    }
  }

  resetData() {
    this.companyName = '';
    this.currentYearPlans = [];
    this.mappedPlans = [];
    this.allFuturePlans = [];
    this.filteredCurrentPlans = [];
    this.filteredMappedPlans = [];
    this.filteredMappedPlansCopy = [];
    this.filteredAllPlans = [];
    this.filteredAllPlansCopy = [];
    this.mappedPlanSelection.clear();
    this.allPlanSelection.clear();
    this.disableAddToCompare();
    this.rowData = [];
    this.onShowDefault = true;
  }

  getAllAvailablePlans(companyId) {
    const paramData = {
      'companyCode': companyId,
      'loggedinEmpId': this.loggedinEmpId,
      'loggedInCompanyCode': this.loggedInCompanyCode,
    }
    this.planAttributeService.getAllPlans(paramData).subscribe((data: any) => {
      this.showSpinner = false;
      this.currentYearPlans = data.currentYearPlans?.data;
      this.filteredCurrentPlans = this.currentYearPlans;
      this.mappedPlans = data.mappedPlans?.data;
      this.allFuturePlans = data.futureYearPlans?.data;
      this.filteredAllPlans = this.allFuturePlans;
      this.filteredAllPlansCopy = this.allFuturePlans;
      this.getPlanLimitCount(paramData);
    });
  }

  getPlanLimitCount(planData) {
    this.planAttributeService.getPlanLimitCount(planData).subscribe((data: any) => {
      if (data.PLAN_COMPARE_LIMIT_COUNT) {
        this.planCompareCount = parseInt(data.PLAN_COMPARE_LIMIT_COUNT);
      }
    }, (_error) => {
      this.planCompareCount = 50;
    });
  }

  private createForm() {
    return this.fb.group(
      {
        companyId: ['', Validators.required],
      }
    );
  }

  onAllPlanSelection(data: any) {
    this.allPlanSelection.toggle(data);
    this.planSelectionForm.controls['allPlans'].setValue([...this.allPlanSelection.selected]);
    this.disableAddToCompare();
  }

  onMappedPlanSelection(data: any) {
    this.mappedPlanSelection.toggle(data);
    this.planSelectionForm.controls['mappedPlans'].setValue([...this.mappedPlanSelection.selected]);
    this.disableAddToCompare();
  }

  disableAddToCompare() {
    const indexOf = this.rowData
      .findIndex(data => data?.currentPlan?.planId === this.currentPlansControl.value?.planId);
    if ((this.mappedPlansControl.value?.length > 0 ||
      this.allPlansControl.value?.length > 0) &&
      this.currentPlansControl.value.planId &&
      this.totalPlanCount(indexOf) <= this.planCompareCount) {
      this.addToCompareDisabled = false;
    }
    else {
      this.addToCompareDisabled = true;
    }
  }

  totalPlanCount(index: number): number {
    let count = this.rowData.length;
    let totalPlanValues = [];
    let sortedPlanValues = [];
    let formControlPlans = [];
    for (let formMapPlan of this.mappedPlansControl.value) {
      formControlPlans.push(formMapPlan.planName);
    }
    for (let formAllPlan of this.allPlansControl.value) {
      formControlPlans.push(formAllPlan.planName);
    }
    const totalMappedAndAllPlans = [...new Set(formControlPlans)]
    this.rowData.forEach((row) => {
      let allAndMappedRowPlans = [];
      for (let mapPlanRow of row.mappedPlans) {
        allAndMappedRowPlans.push(mapPlanRow.planName);
      }
      for (let allPlansRow of row.allPlans) {
        allAndMappedRowPlans.push(allPlansRow.planName);
      }
      sortedPlanValues = [...new Set(allAndMappedRowPlans)];
      sortedPlanValues.push([row.currentPlan.planName])
      totalPlanValues.push(sortedPlanValues);
      count = 0;
      for (const planValues of totalPlanValues) {
        count += planValues.length;
      }
    })
    if (this.currentPlansControl.value.planId) {
      count += index > -1 ? totalMappedAndAllPlans.length : totalMappedAndAllPlans.length + 1;
    }
    return count;
  }

  onCurrentPlanSelection() {
    this.filteredMappedPlans = this.mappedPlans
      .filter(mapped => mapped.parentId === this.currentPlansControl.value?.planId);
    this.filteredMappedPlansCopy = this.filteredMappedPlans;
    this.filteredCurrentPlans = this.currentYearPlans;
    if (this.currentPlansControl.value?.offerType) {
      this.filteredAllPlans = this.allFuturePlans
        .filter(data => data.offerType === this.currentPlansControl.value?.offerType);
      this.filteredAllPlansCopy = this.filteredAllPlans;
      this.planSelectionForm.controls['allPlans'].setValue([]);
      this.allPlanSelection.clear();
    }
    this.planSelectionForm.controls['mappedPlans'].setValue([]);
    this.mappedPlanSelection.clear();
    this.disableAddToCompare();
  }

  onMappedPlanOpen() {
    this.filteredMappedPlans = this.filteredMappedPlansCopy;
  }

  onAllPlanOpen() {
    this.filteredAllPlans = this.filteredAllPlansCopy;
  }

  onFilterPlans(event: any, planValue: string) {
    const searchInput = event?.target?.value?.toLowerCase();
    if (planValue === "current-plan") {
      this.filteredCurrentPlans = this.currentYearPlans.filter((currplan) => {
        const currPlan = currplan.planName.toLowerCase();
        return currPlan.includes(searchInput);
      });
    } else if (planValue === "mapped-plan") {
      this.filteredMappedPlans = this.filteredMappedPlansCopy.filter((mapplan) => {
        const mapPlan = mapplan.planName.toLowerCase();
        return mapPlan.includes(searchInput);
      });
      this.planSelectionForm.controls['mappedPlans'].setValue([...this.mappedPlanSelection.selected]);
    } else {
      this.filteredAllPlans = this.filteredAllPlansCopy.filter((allplan) => {
        const allPlan = allplan.planName.toLowerCase();
        return allPlan.includes(searchInput);
      });
      this.planSelectionForm.controls['allPlans'].setValue([...this.allPlanSelection.selected]);
    }
    this.disableAddToCompare();
  }

  clear(clearPlan: string) {
    if (clearPlan === 'current-year-plan') {
      this.filteredCurrentPlans = this.currentYearPlans;
      this.planSelectionForm.controls['currentPlan'].setValue({});
      this.planSelectionForm.controls['mappedPlans'].setValue([]);
      this.planSelectionForm.controls['allPlans'].setValue([]);
      this.mappedPlanSelection.clear();
      this.allPlanSelection.clear();
      this.filteredMappedPlans = [];
      this.filteredMappedPlansCopy = [];
      this.filteredAllPlansCopy = this.allFuturePlans;
      this.filteredAllPlans = this.filteredAllPlansCopy;
    } else if (clearPlan === 'mapped-plan') {
      this.matRefMapped.options.forEach((data: MatOption) => data.deselect());
      this.planSelectionForm.controls['mappedPlans'].setValue([]);
      this.mappedPlanSelection.clear();
      this.filteredMappedPlans = this.filteredMappedPlansCopy;
    } else {
      this.matRefAll.options.forEach((data: MatOption) => data.deselect());
      this.planSelectionForm.controls['allPlans'].setValue([]);
      this.allPlanSelection.clear();
      this.filteredAllPlans = this.filteredAllPlansCopy;
    }
    this.disableAddToCompare();
  }

  onAddToCompare() {
    if (this.rowData.length === 0) {
      this.rowData.push({ ...this.planSelectionForm.value });
      this.planSelectionForm.controls['allPlans'].setValue([]);
      this.filteredAllPlans = this.allFuturePlans;
    }
    else {
      let indexOf = this.rowData
        .findIndex(data => data?.currentPlan?.planId === this.planSelectionForm.value?.currentPlan?.planId);
      if (indexOf > -1) {
        this.addIfNewOrIgnoreIfExist(this.rowData[indexOf].mappedPlans, this.planSelectionForm.value.mappedPlans);
        this.addIfNewOrIgnoreIfExist(this.rowData[indexOf].allPlans, this.planSelectionForm.value.allPlans);
      }
      else if (indexOf === -1) {
        this.rowData.push({ ...this.planSelectionForm.value });
      }
    }
    this.planSelectionForm = this.creatPlanSelectionForm();
    this.mappedPlanSelection.clear();
    this.allPlanSelection.clear();
    this.onShowDefault = false;
    this.disableAddToCompare();
  }

  expandAllRows() {
    if (this.expandAllToggle) {
      this.rowData.forEach((data) => {
        data.showDetail = true;
      });
      this.expandAllToggle = false;
    }
    else {
      this.rowData.forEach((data) => {
        data.showDetail = false;
      });
      this.expandAllToggle = true;
    }
  }

  removeRow(planId: string) {
    this.rowData = this.rowData.filter(data => data.currentPlan.planId !== planId);
    this.onShowDefault = this.rowData.length === 0 ? true : false;
    this.disableAddToCompare();
  }

  exportAsExcel() {
    const paramData = {
      'companyCode': this.companyId.value.toUpperCase(),
      'loggedinEmpId': this.loggedinEmpId,
      'loggedInCompanyCode': this.loggedInCompanyCode,
    }
    let mappedPlanNames = [];
    let allPlanNames = [];
    const payLoad = {};
    let row = JSON.parse(JSON.stringify(this.rowData));
    row.sort((a, b) => a.currentPlan?.planName.localeCompare(b.currentPlan?.planName, 'en', { numeric: true }));
    row.forEach(data => {
      let mappedAndAllPlanIds = [];
      data.mappedPlans.sort((a, b) => a.planName?.localeCompare(b.planName, 'en', { numeric: true }));
      data.allPlans.sort((a, b) => a.planName?.localeCompare(b.planName, 'en', { numeric: true }));
      for (let i of data.mappedPlans) {
        mappedAndAllPlanIds.push(i.planId);
      }
      for (let i of data.allPlans) {
        mappedAndAllPlanIds.push(i.planId);
      }
      payLoad[data.currentPlan.offerType] = payLoad[data.currentPlan.offerType] ?? {};
      payLoad[data.currentPlan.offerType][data.currentPlan.planId] = mappedAndAllPlanIds;

      for (let i of data.mappedPlans) {
        mappedPlanNames.push(i.planName);
      }
      for (let j of data.allPlans) {
        allPlanNames.push(j.planName);
      }
    });
    let planCountData = allPlanNames.filter(plan => !mappedPlanNames.includes(plan));
    this.planCount = planCountData.length;
    this.googleAnalyticsService.eventEmitter('PlanAttributeCompareExport', { 'Plan_Count': this.planCount, 'Company_ID': this.companyId.value });
    this.showSpinner = true;
    this.planAttributeService.exportAsExcel(paramData, payLoad).subscribe(data => {
      this.showSpinner = false;
      this.downloadExcelFile(data);
    }, _error => {
      this.onFailResponse();
      this.scrollTop();
    });
  }

  downloadExcelFile(data: any) {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type')
    });
    const fileName = data.headers.get('content-disposition')?.split('=')[1];
    saveAs(blob, fileName);
  }

  addIfNewOrIgnoreIfExist(mainArray: any[], childArray: any[]) {
    if (mainArray?.length === 0 && childArray?.length > 0) {
      mainArray.push(...childArray);
    }
    else if (mainArray?.length > 0 && childArray?.length > 0) {
      for (let i of childArray) {
        let indexOf = mainArray.findIndex(data => data?.planId === i.planId);
        if (indexOf === -1) {
          mainArray.push(i);
        }
      }
    }
  }

  changeToArrayFormat(arrayOfObj: any[]) {
    let arr = [];
    for (let i of arrayOfObj) {
      arr.push(i?.planName);
    }
    return arr;
  }

  checkExpandAll() {
    this.expandAllToggle = !this.rowData.every(data => data.showDetail === true);
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  onFailResponse() {
    this.showSpinner = false;
    this.bannerMessage =
      new BannerMessage(AppStringConstants.PLAN_ATTRIBUTES_ERROR_MSG, AppStringConstants.TYPE_ERROR, true);
  }

}
