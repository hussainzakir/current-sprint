import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { map } from "rxjs/operators";
import { AppStringConstants } from "src/app/constants/AppStringConstants";
import { HtmlLabels } from "src/app/constants/HtmlLabels";
import { BannerMessage } from "src/app/models/bannerMessage";
import { HqOverride } from "src/app/models/hqOverride";
import { CommonService } from "src/app/services/common.service";
import { CompanyHqOverridesService } from "src/app/services/company-hq-overrides.service";

@Component({
  selector: "app-new-company-hq-overrides",
  templateUrl: "./new-company-hq-overrides.component.html",
  styleUrls: ["./new-company-hq-overrides.component.scss"],
})
export class NewCompanyHqOverridesComponent implements OnInit {
  newHqOverride: HqOverride;
  companyData: any[];

  @Input() hqOverrideData: any[];
  @Output() newExceptionEmittor = new EventEmitter();
  @Output() bannerMsgEmittor = new EventEmitter();
  spinnerShow: any = false;
  success: any = AppStringConstants.TYPE_SUCCESS;
  createButtonDisable: boolean = false;
  loggedinEmpId: string;
  planYears: any;
  loggedInCompanyCode: string;
  stateAndZips = new Array();
  overideStates = [];
  isCompanyValid: boolean = true;
  companyCodeError = AppStringConstants.COMPANY_ERROR_MSG;
  newOverrideLabel = HtmlLabels.hqOverride;
  constructor(
    private hqOverrideService: CompanyHqOverridesService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) { }
  dateFormatPattern: any;
  minimumValueFund: any;
  maximumValueFund: any;
  isCollapsed: boolean;
  @Input()
  planTypes: any[];

  ngOnInit() {
    this.newHqOverride = new HqOverride();
    this.dateFormatPattern =
      "^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$";
    this.minimumValueFund = 0;
    this.maximumValueFund = 0;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
  }

  onCreate() {
    this.spinnerShow = true;
    this.newHqOverride.companyCode = this.newHqOverride.companyCode.toUpperCase();
    this.hqOverrideService
      .createCompanyHqOverrideDetail(
        this.loggedInCompanyCode,
        this.loggedinEmpId,
        this.newHqOverride
      )
      .subscribe((data) => {
        this.spinnerShow = false;
        let message = AppStringConstants.HQ_OVERRIDE_CREATE_SUCESS;
        message = message.replace('companyCode', this.newHqOverride.companyCode );

        this.bannerMsgEmittor.emit(
          new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true)
        );
        this.createButtonDisable = false;
        this.isCollapsed=false;
        this.newHqOverride={}
      });
  }

  getCompany() {
    if (this.newHqOverride.companyCode == null) {
      this.isCompanyValid = false;
    } else {

      this.newHqOverride.companyCode = this.newHqOverride.companyCode.toUpperCase();
      this.spinnerShow = true;
      this.stateAndZips = [];
      this.hqOverrideService
        .getCompanyData(
          this.loggedInCompanyCode,
          this.loggedinEmpId,
          this.newHqOverride.companyCode
        )
        .subscribe(
          (data) => {
            this.spinnerShow = false;
            if (data.length == 0) {
             this.hqOverrideData= this.hqOverrideData.filter(obj=>obj.companyCode===this.newHqOverride.companyCode)
             let message = AppStringConstants.CREATE_ERROR_OVERIDE_MSG;

             if( this.hqOverrideData.length==0){
              message = AppStringConstants.COMPANY_ERROR_MSG;
              this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_ERROR, true));

             }else {
              this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_INFO, true));

             }
             this.newHqOverride.companyName = undefined;
             this.newHqOverride.oeQuarter = undefined;

            } else {
              this.isCompanyValid = true;
              this.setCompanyData(data);
            }
          },
          (err: HttpErrorResponse) => {
            this.setError(err)
          }
        );
    }
  }
  setError(err){
    this.spinnerShow = false;
      this.isCompanyValid = false;
      let message = AppStringConstants.COMPANY_CODE_ERROR;
      this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_ERROR, true));

  }
  setCompanyData(data) {
    this.planTypes = [];
    this.spinnerShow = false;
    this.newHqOverride.companyCode = data[0].code;
    this.newHqOverride.companyName = data[0].companyName;
    this.newHqOverride.oeQuarter = data[0].oeQuarter;
    if (data[0].hasStrategies) {
      let message = AppStringConstants.HAS_STRATEGIES_INFO_MSG;
      message = message.replace('companyCode', data[0].code);
      message = message.replace('planYearStart', this.datePipe.transform(
        data[0].planYearStartDate,
        AppStringConstants.DATE_FORMAT
      ));
      this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_INFO, true));

    }
    this.companyData = data;
    this.companyData.forEach((company) => {
      this.stateAndZips.push({
        state: company.state,
        zipe: company.zip,
        realmYearId: company.realmYearId,
      });
      this.planTypes.push({
        attributeValue: company.realmYearId,
        name:
          this.datePipe.transform(
            company.planYearStartDate,
            AppStringConstants.DATE_FORMAT
          ) +
          " - " +
          this.datePipe.transform(
            company.planYearEndDate,
            AppStringConstants.DATE_FORMAT
          ),
      });
    });
  }
  handlePlanTypeValue(realmYearId, defaultFlag) {
    let item = this.stateAndZips.filter(function (item, index) {
      return item.realmYearId == realmYearId;
    });
    this.newHqOverride.realmYearId = realmYearId;
    this.newHqOverride.state = item[0].state;
    this.newHqOverride.zip = item[0].zipe;

    this.overideStates = AppStringConstants.STATE_NAME;
    if (this.newHqOverride.state == null) {
      let message = AppStringConstants.CREATE_ERROR_OVERIDE_MSG;
      this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_ERROR, true));
    }
  }
  handleStateData(overrideHqState) {
    this.newHqOverride.overrideHqState = overrideHqState;
  }
  validateButton() {
    if (this.checkNullAndEmpty(this.newHqOverride.overrideHqState)
        ||this.checkNullAndEmpty( this.newHqOverride.overrideHqZip)
        ||this.checkNullAndEmpty(  this.newHqOverride.state)

    ) {
      this.createButtonDisable = false;
      let message = AppStringConstants.CREATE_ERROR_REQUIRED_FEILD_MSG;
      this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_ERROR, true));
    }else {
      this.createButtonDisable = true;
    }
  }
  checkNullAndEmpty(obj){
    if(obj!=null && obj!=""){
      return false
    }else {
      return true;
    }
  }
}
