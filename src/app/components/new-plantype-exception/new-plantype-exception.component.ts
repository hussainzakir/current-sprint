import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BenOfferException } from 'src/app/models/benOfferException';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { Exception } from 'src/app/models/exception';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-plantype-exception',
  templateUrl: './new-plantype-exception.component.html'
})
export class NewPlantypeExceptionComponent implements OnInit {

  benOfferException: BenOfferException;
  @Input() approvers;
  @Input() exceptions;
  @Input() planTypes;
  @Input() originationValues;
  @Input() offeredTypes;

 //@Input() approverEntries;
  @Output() newExceptionEmittor = new EventEmitter();
  @Output() bannerMsgEmittor = new EventEmitter();
  spinnerShow: any = false;
  success: any = AppStringConstants.TYPE_SUCCESS;
  createButtonDisable: boolean = false;
  loggedinEmpId: string;
  loggedInCompanyCode: string;


  constructor(private exceptionService: ExcpetionService,private commonService: CommonService) { }
  dateFormatPattern: any;
  minimumValueFund: any;
  maximumValueFund: any;
  isCollapsed: boolean;

  ngOnInit() {
    this.benOfferException = new BenOfferException();
    this.dateFormatPattern = "^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$";
    this.minimumValueFund = 0;
    this.maximumValueFund = 0;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
  }

  onCreate() {
    this.spinnerShow = true;
    this.benOfferException.companyCode =  this.benOfferException.companyCode.toUpperCase();
    this.exceptionService.createBenOfferException(this.loggedInCompanyCode,this.loggedinEmpId,this.benOfferException).subscribe(newbenOfferException => {
      this.newExceptionEmittor.emit(newbenOfferException);
      this.benOfferException = new BenOfferException();
      this.spinnerShow = false;
      let message = "New Plan Type Exception Created";
      this.bannerMsgEmittor.emit(new BannerMessage(message,AppStringConstants.TYPE_SUCCESS,true));
      this.isCollapsed = !this.isCollapsed;
    },(err:HttpErrorResponse)=>{
      if(err.status && (err.status === 401 || err.status === 403)){
        this.spinnerShow = false;
        let message = err.error._error.message;
        this.bannerMsgEmittor.emit(new BannerMessage(message,AppStringConstants.TYPE_ERROR,true));
      } else{
      this.spinnerShow = false;
      let message = err.error.customMessage;
      this.bannerMsgEmittor.emit(new BannerMessage(message,AppStringConstants.TYPE_ERROR,true));
      }
    });
  }
  getStartDate() {
   this.benOfferException.startDate=  this.benOfferException.startDate.toISOString().substring(0, 10);
   this.createButtonDisable = this.validateNewPlanTypeException();
  }
  getEndDate() {
    this.benOfferException.endDate=  this.benOfferException.endDate.toISOString().substring(0, 10);
    this.createButtonDisable = this.validateNewPlanTypeException();
   }
  handleApproverValue(value) {
    if (this.benOfferException) {
      this.benOfferException.approverId = value;
      this.benOfferException.approverName = this.approvers.find(({ attributeValue }) => attributeValue === value).name;
      this.createButtonDisable = this.validateNewPlanTypeException();
    }
  }
  handlePlanType(value) {
    if (this.benOfferException) {
      this.benOfferException.planType = value;
      this.createButtonDisable = this.validateNewPlanTypeException();
    }
  }
  handleOriginationTypeChange(value) {
    if (this.benOfferException) {
      this.benOfferException.originDept = value;
      this.benOfferException.originationDeptName = this.originationValues.find(({ attributeValue }) => attributeValue === value).name;
      this.createButtonDisable = this.validateNewPlanTypeException();
    }
  }
  handleOfferedTypeChange(value) {
 this.benOfferException.offered = (value===AppStringConstants.OFFERED)?true:false;
 this.createButtonDisable = this.validateNewPlanTypeException();
  }
  validateNewPlanTypeException(){
    if(this.benOfferException!== null && this.benOfferException){
      if(this.benOfferException.startDate !== undefined  &&this.benOfferException.startDate !== null &&  this.benOfferException.startDate !== '' && 
       this.benOfferException.endDate !== undefined && this.benOfferException.endDate !== null &&  this.benOfferException.endDate !== '' &&
         this.benOfferException.originDept !== undefined && this.benOfferException.originDept !== null && this.benOfferException.originDept !== '' &&
        this.benOfferException.offered !== undefined  && this.benOfferException.offered !== null  && 
         this.benOfferException.planType !== undefined && this.benOfferException.planType !== null && this.benOfferException.planType !== '' &&
        this.benOfferException.approverId !== undefined && this.benOfferException.approverId !== null && this.benOfferException.approverId !== ''  
         && this.benOfferException.companyCode !== undefined && this.benOfferException.companyCode !== null  && this.benOfferException.companyCode !==''
          && this.benOfferException.companyName !== undefined && this.benOfferException.companyName !== null && this.benOfferException.companyName !=='')
        {
          return true;
        }
        else{
          return false;
        }
    }
  }
  getCompany() {
    // this.spinnerShow = true;
    this.exceptionService.getAllCompanies(this.loggedInCompanyCode, this.loggedinEmpId,this.benOfferException.companyCode).pipe(map((data) => {
      if (data.hasOwnProperty(this.benOfferException.companyCode.toUpperCase())) {
        // this.spinnerShow = false;
        this.benOfferException.companyName = data[this.benOfferException.companyCode.toUpperCase()];
        this.bannerMsgEmittor.emit(new BannerMessage(null,null,false));

      } else {
        // this.spinnerShow = false;
        let message = "Enter a valid Company Code";
        this.benOfferException.companyName = "";
        this.bannerMsgEmittor.emit(new BannerMessage(message,AppStringConstants.TYPE_ERROR,true));
      }

    })).subscribe(_ => {
    }
    ,(err:HttpErrorResponse)=>{
      if(err.status && (err.status === 401 || err.status === 403)){
        this.benOfferException.companyName = "";
        let message = err.error._error.message;
        this.bannerMsgEmittor.emit(new BannerMessage(message,AppStringConstants.TYPE_ERROR,true));
      } else{
      this.benOfferException.companyName = "";
      let message = err.error.customMessage;
      this.bannerMsgEmittor.emit(new BannerMessage(message,AppStringConstants.TYPE_ERROR,true));
      }
    });

  }
}
  