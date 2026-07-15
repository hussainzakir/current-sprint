import { Component, OnInit, HostListener, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { CommonService } from 'src/app/services/common.service';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BenOfferException } from 'src/app/models/benOfferException';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { RowEditable } from 'src/app/models/rowEditable';

@Component({
  selector: 'app-plantype-exceptions',
  templateUrl: './plantype-exceptions.component.html'
})
export class PlantypeExceptionsComponent implements OnInit {
  filterExchangeValue: any;
  selectedQuarter: any;
  selectedCompanyCode: any;
  fixed: boolean;
  scrollTopHover: boolean;
  planTypeTableHeaders: any;
  timestampColumn: any = AppStringConstants.TIMESTAMP_COLUMN;
  bannerMessage: any;
  exceptionAttributes: any;
  approverEntries: any;
  approvers: any[];
  benOfferExceptionsData: BenOfferException[];
  spinnerShow: boolean = false;
  rowEditableList: any[] = new Array();
  planTypeEntries:any;
  planTypes: any;
  originationEntries:any;
  originationValues: any;
  offeredTypes: any;
  headerValues: any[];
  pageTitle: any = AppStringConstants.PLANTYPE_EXCEPTIONS_TITLE;
  benOfferCloneExceptionsData: BenOfferException[] = new Array<BenOfferException>();
  clearFlag: boolean;
  loggedinEmpId: string;
  loggedInCompanyCode: string;

  constructor(private exceptionService: ExcpetionService, private commonService: CommonService,  private cdref: ChangeDetectorRef ) { }

  ngOnInit() {
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.bannerMessage =  new BannerMessage('','',false);
    this.getExceptionAttributes();
    this.getAllPlanTypeExceptions();
    this.approvers =[];
    this.planTypes = [];
    this.originationValues =[];
    this.planTypeTableHeaders = AppStringConstants.PLANTYPE_EXCEPTION_TABLE_HEADERS;
    this.headerValues = Array.from(this.planTypeTableHeaders.keys());

  }
  ngAfterViewInit(){
    this.cdref.detectChanges();
  }
  handleSelectedExchangeChange(exchange){
    this.filterExchangeValue = exchange;
  }
  handleSelectedQuarterChange(quarter){
    this.selectedQuarter = quarter;
  }
  handleSelectedCompanyChange(companyCode){
    this.selectedCompanyCode = companyCode;
  }
  getExceptionAttributes() {
    this.exceptionService.getExceptionAttributes(this.loggedInCompanyCode,this.loggedinEmpId).pipe(map((exceptionAttributes) => {
      this.exceptionAttributes = exceptionAttributes;
    })).subscribe(_ => {
      this.approvers = [];
      this.exceptionAttributes.forEach(exception => {
        if(exception.exceptionId === 2){
          exception.attributes.forEach(attribute => {
            switch(attribute.attributeId){
              case 1:
                this.planTypes = attribute.values;
                break;
              case 2:
                this.approvers = attribute.values;
                break;
              case 3:
                this.originationValues =  attribute.values;
                break;
                case 4:
                  this.offeredTypes = attribute.values;
                  break;
            }
          });
        }
       
    });
  },(err:HttpErrorResponse)=>{
    if(err.status && (err.status === 401 || err.status === 403)){
      let message = err.error._error.message;
      this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
    } else{
    let message = err.error.customMessage;
    this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
    }
  });
}
  getAllPlanTypeExceptions() {
    this.spinnerShow = true;
    this.exceptionService.getAllBenOfferExceptions(this.loggedInCompanyCode,this.loggedinEmpId).pipe(map((benOfferExceptions) => {
      this.benOfferExceptionsData = this.sort(benOfferExceptions, this.timestampColumn, '');
      this.benOfferCloneExceptionsData = JSON.parse(JSON.stringify(this.benOfferExceptionsData));
    })).subscribe(_ => {
      this.createRowEditableList();
      this.spinnerShow = false;
      this.cdref.detectChanges();
    },(err:HttpErrorResponse)=>{
      if(err.status && (err.status === 401 || err.status === 403)){
        let message = err.error._error.message;
        this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
      } else{
        let message = err.error.customMessage;
        this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
      }
    });
    
  }
  createRowEditableList() {
    this.benOfferExceptionsData.forEach(element => {
      let rowEditableObject: RowEditable = new RowEditable();
      rowEditableObject.editable = true;
      rowEditableObject.saveButtonEditable = false;
      this.rowEditableList.push(rowEditableObject);
    });
  }
  onEditClick(index,exceptionId) {
    if (this.rowEditableList[index].editable) {
      this.rowEditableList[index].editable = !this.rowEditableList[index].editable;
      this.cdref.detectChanges();
    } else {
      //refresh click
      this.rowEditableList[index].editable = !this.rowEditableList[index].editable;
      this.cdref.detectChanges();
      this.exceptionService.getBenOfferException(this.loggedInCompanyCode,this.loggedinEmpId,this.benOfferExceptionsData.find(({ id }) => id === exceptionId).id).subscribe(exceptionNode => {
        Object.assign(this.benOfferExceptionsData.find(({ id }) => id === exceptionId), exceptionNode);
      });
    }
  }
  getPlanName(planType){
    if(this.planTypes.find(({ attributeValue }) => attributeValue === planType))
    return this.planTypes.find(({ attributeValue }) => attributeValue === planType).name;
    else return AppStringConstants.UNKNOWN_PLANTYPE;
  }
  getOfferedValue(offered){
   
    if(offered) {
      return AppStringConstants.OFFERED;
    } else {
      return AppStringConstants.NOT_OFFERED;
    }
    //if(offered) return this.offeredTypes && this.offeredTypes.length >0?this.offeredTypes[0].name:"";
    //else return this.offeredTypes && this.offeredTypes.length >0?this.offeredTypes[1].name:"";
  }

  //UpdateTypeChanges
  getStartDate(event:MatDatepickerInputEvent<Date>,exceptionId,savebuttonEnableIndex){
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).startDate = event.value.toISOString().substring(0, 10);
    this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
    // if(event){
    //   this.benOfferExceptionsData.find(({ id }) => id === exceptionId).startDate = event.value.toISOString().substring(0, 10);
    //   this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
    // }
    // else{
    //   this.disableSaveButton(savebuttonEnableIndex);
    // }
  }
  getEndDate(event:MatDatepickerInputEvent<Date>,exceptionId,savebuttonEnableIndex){
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).endDate = event.value.toISOString().substring(0, 10);
    this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
    // if(event){
    //   this.benOfferExceptionsData.find(({ id }) => id === exceptionId).endDate = event.value.toISOString().substring(0, 10);
    //   this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
    // }
    // else{
    //   this.disableSaveButton(savebuttonEnableIndex);
    // }
  }
  handlePlanTypeChange(planType,exceptionId,savebuttonEnableIndex){
    if(this.benOfferExceptionsData){
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).planType = planType;
    this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
  }
    else{
      this.disableSaveButton(savebuttonEnableIndex);
    }
  }
  handleApproverChange(approver,exceptionId,savebuttonEnableIndex){
    if(this.approvers && this.benOfferExceptionsData){
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).approverId = approver;
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).approverName = this.approvers.find(({ attributeValue }) => attributeValue === approver).name;
    this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
  }
    else{
      this.disableSaveButton(savebuttonEnableIndex);
    }
  }
  handleOfferedTypeChange(offeredType,exceptionId,savebuttonEnableIndex){
    let offeredBooleanValue: any = (offeredType=== AppStringConstants.OFFERED)?true:false;
    if(this.offeredTypes && this.benOfferExceptionsData){
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).offered = offeredBooleanValue;
    this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
  }
    else{
      this.disableSaveButton(savebuttonEnableIndex);
    }
  }
  handleOriginationTypeChange(originationType,exceptionId,savebuttonEnableIndex){
    if(this.originationValues && this.benOfferExceptionsData){
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).originDept = originationType;
    this.benOfferExceptionsData.find(({ id }) => id === exceptionId).originationDeptName = this.originationValues.find(({ attributeValue }) => attributeValue === originationType).name;
    this.shallowCompareEnablingSave(this.benOfferExceptionsData.find(({ id }) => id === exceptionId),this.benOfferCloneExceptionsData.find(({ id }) => id === exceptionId),savebuttonEnableIndex);
  }
    else{
      this.disableSaveButton(savebuttonEnableIndex);
    }
  }
  onUpdate(index,exceptionId) {
    let message = "";
    this.spinnerShow = true; 
    this.disableSaveButton(index);
    let editedExceptionObject = this.benOfferExceptionsData.find(({ id }) => id === exceptionId);
       this.spinnerShow = true;
       this.exceptionService.editBenOfferException(this.loggedInCompanyCode,this.loggedinEmpId,editedExceptionObject).pipe(map((returnedExceptionObject) => {
         Object.assign(this.benOfferExceptionsData.find(({ id }) => id === exceptionId), returnedExceptionObject);
       })).subscribe(_ => {
          this.rowEditableList[index].editable = !this.rowEditableList[index].editable;
          this.cdref.detectChanges();
          this.spinnerShow = false;
          message ="Plan Type Exception for "+ editedExceptionObject.companyName + " has been successfully updated";
          this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_SUCCESS,true);
          this.benOfferExceptionsData = this.sort(this.benOfferExceptionsData, this.timestampColumn, '');
          this.benOfferCloneExceptionsData = JSON.parse(JSON.stringify(this.benOfferExceptionsData));
          this.scrollTop();
          let emptyString ='';
          this.handleSelectedExchangeChange(emptyString);
          this.handleSelectedQuarterChange(emptyString);
          this.handleSelectedCompanyChange(emptyString);
       },
       (err:HttpErrorResponse)=>{
        if(err.status && (err.status === 401 || err.status === 403)){
          message = err.error._error.message;
          this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
          this.scrollTop();
        } else{
         this.spinnerShow = false;
         message = err.error.customMessage;
         this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
         this.scrollTop();
        }
       }); 
     }

     addNewBenOfferException(newBenOfferException: BenOfferException){
      let emptyString ='';
      this.handleSelectedExchangeChange(emptyString);
      this.handleSelectedQuarterChange(emptyString);
      this.handleSelectedCompanyChange(emptyString);
      this.clearFlag = true;
      let rowEditableObject: RowEditable = new RowEditable();
      rowEditableObject.editable = true;
      rowEditableObject.saveButtonEditable = false;
      this.rowEditableList.push(rowEditableObject);   
      this.benOfferExceptionsData.push(newBenOfferException);
      this.cdref.detectChanges();
      this.benOfferExceptionsData = this.sort(this.benOfferExceptionsData, this.timestampColumn, '');
      this.scrollTop();
     }
     handleNewExceptionBanner(bannerMessage : BannerMessage){
      Object.assign(this.bannerMessage,bannerMessage);
    }
    enableSaveButton(index){
      if(this.rowEditableList[index])
      this.rowEditableList[index].saveButtonEditable = true;
    }
    disableSaveButton(index){
      if(this.rowEditableList[index])
      this.rowEditableList[index].saveButtonEditable = false;
    }
    shallowCompareEnablingSave(original:BenOfferException,clone:BenOfferException,savebuttonEnableIndex){
      if(this.shallowCompare(original,clone))
      this.disableSaveButton(savebuttonEnableIndex);
      else
      this.enableSaveButton(savebuttonEnableIndex);
    }
    shallowCompare(original:BenOfferException,clone:BenOfferException){
      if(original && clone && original!== null && clone!==null){
        if((original.planType === clone.planType) && (original.originDept === clone.originDept) && (original.offered === clone.offered) && (original.approverId === clone.approverId) && (original.endDate === clone.endDate) &&  (original.startDate === clone.startDate))
        {
          return true;
        }
        else return false;
      }
    }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTopHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTopHeight > 200) {
      this.fixed = true;
    }
    else {
      this.fixed = false;
    }
  }
  scrollTop() {
    window.scrollTo(0, 0);
    this.scrollTopHover = false;
  }


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;



  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.benOfferExceptionsData = this.sort(this.benOfferExceptionsData, column, direction);
  }
  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  sort(benOfferExceptions: BenOfferException[], column: string, direction: string): BenOfferException[] {
    const columnValue = this.planTypeTableHeaders.get(column);
    if (direction === '') {
      return [...benOfferExceptions].sort((a, b) => {
        const res = this.compare(a[this.planTypeTableHeaders.get(this.timestampColumn)], b[this.planTypeTableHeaders.get(this.timestampColumn)]);
        return -res;
      });
    } else {
      return [...benOfferExceptions].sort((a, b) => {
        const res = this.compare(a[columnValue], b[columnValue]);
        return direction === 'asc' ? res : -res;
      });
    }
  }


}

