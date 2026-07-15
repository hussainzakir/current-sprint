import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Exception } from 'src/app/models/exception';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { map } from 'rxjs/operators';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { HttpErrorResponse } from '@angular/common/http';
import { Utils } from '@trinet/common';
import { IfStmt } from '@angular/compiler';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-exception',
  templateUrl: './new-exception.component.html',
})
export class NewExceptionComponent implements OnInit {
  newException: Exception;
  @Input() approvers;
  @Input() exceptions;
  @Input() exceptionTypes;
  @Input() planTypes;
  @Input() deselectionException;
  @Output() newExceptionEmittor = new EventEmitter();
  @Output() bannerMsgEmittor = new EventEmitter();

  spinnerShow: any = false;
  success: any = AppStringConstants.TYPE_SUCCESS;
  createButtonDisable: boolean = false;
  loggedinEmpId: string;
  loggedInCompanyCode: string;
  minDate: Date = AppStringConstants.MIN_DATE_DESELECTION_EXCEPTION;

  constructor(private exceptionService: ExcpetionService, private commonService: CommonService) {}
  dateFormatPattern: any;
  minimumValueFund: any;
  maximumValueFund: any;
  isCollapsed: boolean;

  ngOnInit() {
    this.newException = new Exception();
    this.dateFormatPattern =
      '^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$';
    this.minimumValueFund = 0;
    this.maximumValueFund = 0;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
  }

  onCreate() {
    this.spinnerShow = true;
    this.newException.companyCode = this.newException.companyCode.toUpperCase();
    if (!this.deselectionException) {
      this.exceptionService
        .createException(this.loggedInCompanyCode, this.loggedinEmpId, this.newException)
        .subscribe(
          (newException) => {
            this.newExceptionEmittor.emit(newException);
            this.newException = new Exception();
            this.spinnerShow = false;
            let message = 'New Minimum Funding Exception Created';
            this.bannerMsgEmittor.emit(
              new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true)
            );
            this.isCollapsed = !this.isCollapsed;
          },
          (err: HttpErrorResponse) => {
            if (err.status && (err.status === 401 || err.status === 403)) {
              this.spinnerShow = false;
              let message = err.error._error.message;
              this.bannerMsgEmittor.emit(
                new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
              );
            } else {
              this.spinnerShow = false;
              let message = err.error.customMessage;
              this.bannerMsgEmittor.emit(
                new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
              );
            }
          }
        );
    } else {
      this.exceptionService
        .createDeselectionException(this.loggedInCompanyCode, this.loggedinEmpId, this.newException)
        .subscribe(
          (newException) => {
            this.newExceptionEmittor.emit(newException);
            this.newException = new Exception();
            this.spinnerShow = false;
            let message = 'New Plan Deselection Exception Created';
            this.bannerMsgEmittor.emit(
              new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true)
            );
            this.isCollapsed = !this.isCollapsed;
          },
          (err: HttpErrorResponse) => {
            if (err.status && (err.status === 401 || err.status === 403)) {
              this.spinnerShow = false;
              let message = err.error._error.message;
              this.bannerMsgEmittor.emit(
                new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
              );
            } else {
              this.spinnerShow = false;
              let message = err.error.customMessage;
              this.bannerMsgEmittor.emit(
                new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
              );
            }
          }
        );
    }
  }
  getStartDate() {
    this.newException.startDate = this.newException.startDate.toISOString().substring(0, 10);
    this.createButtonDisable = this.validateException();
  }
  getEndDate() {
    this.newException.endDate = this.newException.endDate.toISOString().substring(0, 10);
    this.createButtonDisable = this.validateException();
  }
  handleApproverValue(value) {
    if (this.newException) {
      this.newException.approverId = value;
      this.newException.approverName = this.approvers.find(
        ({ attributeValue }) => attributeValue === value
      ).name;
      this.createButtonDisable = this.validateException();
    }
  }
  handlePlanType(value) {
    if (this.newException) {
      this.newException.planType = value;
      this.createButtonDisable = this.validateException();
    }
  }
  validateException() {
    if (!this.deselectionException) {
      if (this.newException !== null && this.newException) {
        if (
          this.newException.startDate !== undefined &&
          this.newException.startDate !== null &&
          this.newException.startDate !== '' &&
          this.newException.endDate !== undefined &&
          this.newException.endDate !== null &&
          this.newException.endDate !== '' &&
          this.newException.minFundType !== undefined &&
          this.newException.minFundType !== null &&
          this.newException.minFundType !== '' &&
          this.newException.minFundValue !== undefined &&
          this.newException.minFundValue !== null &&
          this.newException.minFundValue !== '' &&
          this.newException.planType !== undefined &&
          this.newException.planType !== null &&
          this.newException.planType !== '' &&
          this.newException.approverId !== undefined &&
          this.newException.approverId !== null &&
          this.newException.approverId !== '' &&
          this.newException.companyCode !== undefined &&
          this.newException.companyCode !== null &&
          this.newException.companyCode !== '' &&
          this.newException.companyName !== undefined &&
          this.newException.companyName !== null &&
          this.newException.companyName !== ''
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      if (this.newException !== null && this.newException) {
        if (
          this.newException.startDate !== undefined &&
          this.newException.startDate !== null &&
          this.newException.startDate !== '' &&
          this.newException.endDate !== undefined &&
          this.newException.endDate !== null &&
          this.newException.endDate !== '' &&
          this.newException.approverId !== undefined &&
          this.newException.approverId !== null &&
          this.newException.approverId !== '' &&
          this.newException.companyCode !== undefined &&
          this.newException.companyCode !== null &&
          this.newException.companyCode !== '' &&
          this.newException.companyName !== undefined &&
          this.newException.companyName !== null &&
          this.newException.companyName !== ''
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  handleMinFundExceptionType(value) {
    this.newException.minFundType = value;
    switch (value) {
      case AppStringConstants.EXCEPTION_TYPES[0]: {
        this.minimumValueFund = 0;
        this.maximumValueFund = 100;
        this.newException.minFundValue = 0;
        this.createButtonDisable = this.validateException();
        break;
      }

      case AppStringConstants.EXCEPTION_TYPES[1]: {
        this.minimumValueFund = 0;
        this.maximumValueFund = 10000;
        this.newException.minFundValue = 0;
        this.createButtonDisable = this.validateException();
        break;
      }

      case AppStringConstants.EXCEPTION_TYPES[2]: {
        this.minimumValueFund = 0;
        this.maximumValueFund = 0;
        this.newException.minFundValue = 0;
        this.createButtonDisable = this.validateException();
        break;
      }
    }
  }

  getCompany() {
    // this.spinnerShow = true;
    this.exceptionService
      .getAllCompanies(this.loggedInCompanyCode, this.loggedinEmpId, this.newException.companyCode)
      .pipe(
        map((data) => {
          if (data.hasOwnProperty(this.newException.companyCode.toUpperCase())) {
            // this.spinnerShow = false;
            this.newException.companyName = data[this.newException.companyCode.toUpperCase()];
            this.bannerMsgEmittor.emit(new BannerMessage(null, null, false));
          } else {
            // this.spinnerShow = false;
            let message = 'Enter a valid Company Code';
            this.newException.companyName = '';
            this.bannerMsgEmittor.emit(
              new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
            );
          }
        })
      )
      .subscribe(
        (_) => {},
        (err: HttpErrorResponse) => {
          if (err.status && (err.status === 401 || err.status === 403)) {
            this.newException.companyName = '';
            let message = err.error._error.message;
            this.bannerMsgEmittor.emit(
              new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
            );
          } else {
            this.newException.companyName = '';
            let message = err.error.customMessage;
            this.bannerMsgEmittor.emit(
              new BannerMessage(message, AppStringConstants.TYPE_ERROR, true)
            );
          }
        }
      );
  }
}
