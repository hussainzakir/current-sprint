import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { CommonService } from 'src/app/services/common.service';
import { ExcpetionService } from 'src/app/services/excpetion.service';

@Component({
  selector: 'app-new-life-di-exception',
  templateUrl: './new-life-di-exception.component.html',
})
export class NewLifeDiExceptionComponent implements OnInit {
  @Input() approvers: any[] = [];
  @Input() exceptions: any[] = [];
  @Output() newExceptionEmittor = new EventEmitter<any>();
  @Output() bannerMsgEmittor = new EventEmitter<BannerMessage>();

  newException: any;
  bandOptions: string[] = AppStringConstants.LIFE_DISABILITY_BANDS;
  spinnerShow = false;
  createButtonDisable = false;
  isCollapsed = false;
  loggedinEmpId: string;
  loggedInCompanyCode: string;

  constructor(
    private readonly exceptionService: ExcpetionService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit() {
    this.newException = {
      companyCode: '',
      companyName: '',
      startDate: '',
      endDate: '',
      assignedLifeBand: '',
      overrideLifeBand: '',
      assignedDisabilityBand: '',
      overrideDisabilityBand: '',
      approverId: '',
      approverName: '',
    };
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
  }

  getCompany() {
    if (!this.newException?.companyCode) {
      return;
    }

    this.newException.companyCode = this.newException.companyCode.toUpperCase();
    this.exceptionService
      .getAllCompanies(this.loggedInCompanyCode, this.loggedinEmpId, this.newException.companyCode)
      .pipe(
        map((data) => {
          const companyCode = this.newException.companyCode.toUpperCase();
          if (data && data.hasOwnProperty(companyCode)) {
            this.newException.companyName = data[companyCode];
            this.syncExistingBandValues();
            this.bannerMsgEmittor.emit(new BannerMessage('', '', false));
          } else {
            this.newException.companyName = '';
            this.newException.assignedLifeBand = '';
            this.newException.assignedDisabilityBand = '';
            this.bannerMsgEmittor.emit(
              new BannerMessage('Enter a valid Company Code', AppStringConstants.TYPE_ERROR, true),
            );
          }
        }),
      )
      .subscribe(
        () => {
          this.createButtonDisable = this.validateException();
        },
        (err: HttpErrorResponse) => {
          this.newException.companyName = '';
          this.newException.assignedLifeBand = '';
          this.newException.assignedDisabilityBand = '';
          let message = err.status && (err.status === 401 || err.status === 403)
            ? err.error?._error?.message
            : err.error?.customMessage;
          this.bannerMsgEmittor.emit(new BannerMessage(message, AppStringConstants.TYPE_ERROR, true));
        },
      );
  }

  syncExistingBandValues() {
    const matchingException = this.exceptions.find(
      (exception) => exception.companyCode?.toUpperCase() === this.newException.companyCode.toUpperCase(),
    );

    if (matchingException) {
      this.newException.assignedLifeBand = matchingException.assignedLifeBand;
      this.newException.assignedDisabilityBand = matchingException.assignedDisabilityBand;
    } else {
      this.newException.assignedLifeBand = '';
      this.newException.assignedDisabilityBand = '';
    }
  }

  getStartDate() {
    if (this.newException?.startDate) {
      this.newException.startDate = this.formatDate(this.newException.startDate);
    }
    this.createButtonDisable = this.validateException();
  }

  getEndDate() {
    if (this.newException?.endDate) {
      this.newException.endDate = this.formatDate(this.newException.endDate);
    }
    this.createButtonDisable = this.validateException();
  }

  handleApproverValue(value: any) {
    if (!this.newException) {
      return;
    }
    this.newException.approverId = value;
    this.newException.approverName = this.approvers.find(
      ({ attributeValue }) => attributeValue === value,
    )?.name;
    this.createButtonDisable = this.validateException();
  }

  handleOverrideLifeBandValue(value: any) {
    if (!this.newException) {
      return;
    }
    this.newException.overrideLifeBand = value;
    this.createButtonDisable = this.validateException();
  }

  handleOverrideDisabilityBandValue(value: any) {
    if (!this.newException) {
      return;
    }
    this.newException.overrideDisabilityBand = value;
    this.createButtonDisable = this.validateException();
  }

  validateException() {
    if (!this.newException) {
      return false;
    }

    return !!(
      this.newException.companyCode &&
      this.newException.companyName &&
      this.newException.startDate &&
      this.newException.endDate &&
      this.newException.overrideLifeBand &&
      this.newException.overrideDisabilityBand &&
      this.newException.approverId
    );
  }

  onCreate() {
    if (!this.validateException()) {
      return;
    }

    this.spinnerShow = true;
    const createdException = {
      ...this.newException,
      id: Date.now(),
      createTime: new Date().getTime(),
    };

    this.newExceptionEmittor.emit(createdException);
    this.newException = {
      companyCode: '',
      companyName: '',
      startDate: '',
      endDate: '',
      assignedLifeBand: '',
      overrideLifeBand: '',
      assignedDisabilityBand: '',
      overrideDisabilityBand: '',
      approverId: '',
      approverName: '',
    };
    this.isCollapsed = false;
    this.spinnerShow = false;
    this.createButtonDisable = false;
    this.bannerMsgEmittor.emit(
      new BannerMessage('Exception Added Successfully', AppStringConstants.TYPE_SUCCESS, true),
    );
  }

  private formatDate(value: any): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString().substring(0, 10);
    }

    if (typeof value === 'string') {
      return value.substring(0, 10);
    }

    return value;
  }
}
