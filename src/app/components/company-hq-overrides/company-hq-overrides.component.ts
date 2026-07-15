import { DatePipe, DOCUMENT } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AppStringConstants } from "../../constants/AppStringConstants";
import { HtmlLabels } from "../../constants/HtmlLabels";
import {
  NgbdSortableHeader,
  SortEvent,
} from "../../directives/sortable.directive";
import { BannerMessage } from "src/app/models/bannerMessage";
import { HqOverride } from "src/app/models/hqOverride";
import { RowEditable } from "src/app/models/rowEditable";
import { CommonService } from "src/app/services/common.service";
import { CompanyHqOverridesService } from "src/app/services/company-hq-overrides.service";
import { WarningDialogComponent } from "../warning-dialog/warning-dialog.component";

@Component({
  selector: "app-company-hq-overrides",
  templateUrl: "./company-hq-overrides.component.html",
  styleUrls: ["./company-hq-overrides.component.scss"],
})
export class CompanyHqOverridesComponent  implements OnInit {
  companyHqOverrridesHeader: Map<any, any> = new Map<any, any>();
  newHqOverride: any[] = [];
  filterExchangeValue: any;
  selectedCompanyCode: string;
  selectedQuarter: any;
  hasStrategies:boolean;
  rowEditableList: any[] = new Array();
  scrollTopHover: boolean;
  companyCode: string = null;
  quarter: string = null;
  fixed: boolean;
  headerValues: any[] = new Array();
  dateFormatPattern: any;
  spinnerShow: boolean;
  bannerMessage: BannerMessage;
  success: any = AppStringConstants.TYPE_SUCCESS;
  timestampColumn: any = AppStringConstants.TIMESTAMP_COLUMN;
  hqOverrideAttributes: any[];
  pageTitle: any = AppStringConstants.HQ_OVERRIDE_EXCEPTIONS_TITLE;
  hqOverrideCloneData: HqOverride[] = new Array<HqOverride>();
  clearFlag: boolean;
  loggedinEmpId: string;
  loggedInCompanyCode: string;
  openOnEditMode = false;
  overideStates = AppStringConstants.STATE_NAME;
  newOverrideLabel=HtmlLabels.hqOverride;

  constructor(
    private hqOverrideService: CompanyHqOverridesService,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document: Document,
    private cdref: ChangeDetectorRef,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.companyHqOverrridesHeader =
      AppStringConstants.COMPANY_HQ_OVERRIDES_TABLE_HEADERS;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.getHqOverrideAttributes();
    this.headerValues = Array.from(this.companyHqOverrridesHeader.keys());
    this.dateFormatPattern =
      "^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$";
    this.bannerMessage = new BannerMessage("", "", false);
  }
  ngAfterViewInit() {
    this.cdref.detectChanges();
  }
  getAllHqOverride(){
    this.getHqOverrideAttributes();
  }
  getHqOverrideAttributes() {
    this.hqOverrideService
      .getCompanyHqOverrideDetail(
        this.loggedInCompanyCode,
        this.loggedinEmpId,
        this.companyCode,
        this.quarter
      )
       
      .subscribe((hqOverrideAttributes) => {
        this.hqOverrideAttributes=[];
        this.hqOverrideAttributes=hqOverrideAttributes;
         Object.assign( this.hqOverrideAttributes,hqOverrideAttributes);
        this.createRowEditableList();
        this.scrollTop();

      });
  }
  closeBanner(bannerMessage) {
    setTimeout(
      function () {
        this.bannerMessage.bannerMessageShow = false;
      }.bind(this),
      10000
    );
  
}
  handleNewExceptionBanner(bannerMessage: BannerMessage) {
    Object.assign(this.bannerMessage, bannerMessage);
    this.closeBanner(bannerMessage);
    this.getHqOverrideAttributes();
  }
  handleStateData(overrideHqState, index) {
    this.enableSaveButton(index);
    this.newHqOverride = overrideHqState;
    this.hqOverrideAttributes[index].overrideHqState = overrideHqState;
    this.cdref.detectChanges();
  }
  handleSelectedExchangeChange(exchange) {
    this.filterExchangeValue = exchange;
  }
  openDialog(hqOverride) {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '450px',
      data: {title: 'Warning',
       lable: 'Are you sure you want to delete this override?',actionYes:'Ok',actionNo:'No Thanks'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==='Ok'){
        this.deleteHq(hqOverride)
      }
    });
  }
  deleteHq(hqOverride){
    this.hqOverrideService.deleteHq(this.loggedInCompanyCode,this.loggedinEmpId,hqOverride.companyCode,hqOverride.realmYearId).subscribe(data=>{
      this.getAllHqOverride();
      this.spinnerShow = false;
      let message = AppStringConstants.HQ_OVERRIDE_DELETE_SUCESS;
      message=message.replace("companyCode",hqOverride.companyCode)
      this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_SUCCESS,true);
      this.closeBanner( this.bannerMessage);
      this.scrollTop();

    });
  }
  handleDeleteClick(index,hqOverride){
    this.openDialog(hqOverride);
  
  }
  handleSelectedQuarterChange(quarter) {
    if ((quarter==null || quarter === "" )) {
      quarter = null;
      this.companyCode=null;
      this.clearFlag=true;
 
    }
    this.selectedQuarter = quarter;
    this.quarter = quarter;
    this.getHqOverrideAttributes();
    this.cdref.detectChanges();
    this.clearFlag=false;
    this.cdref.detectChanges();


  }
  getAttributeName(attributeArray, attributeSearchValue) {
    if (
      attributeArray.find(
        ({ attributeValue }) => attributeValue === attributeSearchValue
      )
    )
      return attributeArray.find(
        ({ attributeValue }) => attributeValue === attributeSearchValue
      ).name;
  }
  createRowEditableList() {
    this.hqOverrideAttributes.forEach((element) => {
      let rowEditableObject: RowEditable = new RowEditable();
      rowEditableObject.editable = true;
      rowEditableObject.saveButtonEditable = false;
      this.rowEditableList.push(rowEditableObject);
    });
  }
  onEditClick(index, hqOverrideObj) {
    this.openOnEditMode = !this.openOnEditMode 
    if (this.rowEditableList[index].editable  && hqOverrideObj.canEdit) {
      this.rowEditableList[index].editable =
        !this.rowEditableList[index].editable ;
  
      this.cdref.detectChanges();
    } else {
      //refresh click

      this.bannerMessage.bannerMessageShow=false;
      if(this.hqOverrideAttributes[index].canEdit){
        this.rowEditableList[index].editable =
        !this.rowEditableList[index].editable;
        this.companyCode = hqOverrideObj.companyCode  ;
        this.quarter = hqOverrideObj.oeQuarter;
        this.hqOverrideService
          .getCompanyHqOverrideDetail(
            this.loggedInCompanyCode,
            this.loggedinEmpId,
            hqOverrideObj.companyCode,
            hqOverrideObj.oeQuarter
          )
          .subscribe((data) => {
            Object.assign((this.hqOverrideAttributes[index] = data[0]));

            this.cdref.detectChanges();
          });
      }
    }
  }
  onClone(newHqOverride,index){
    newHqOverride.realmYearId=newHqOverride.nextRealmYearId;
    this.spinnerShow = true;
    newHqOverride.companyCode = newHqOverride.companyCode.toUpperCase();
    this.hqOverrideService
      .createCompanyHqOverrideDetail(
        this.loggedInCompanyCode,
        this.loggedinEmpId,
        newHqOverride
      )
      .subscribe((data) => {
        this.spinnerShow = false;
        let message = AppStringConstants.HQ_OVERRIDE_CLONE_SUCESS;
        message=message.replace("companyCode",data.companyCode)
        this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_SUCCESS,true);
                this.closeBanner( this.bannerMessage);

        this.getAllHqOverride();


      });
  
  }
  onUpdate(newHqOverride,index) {
    this.spinnerShow = true;
    newHqOverride.companyCode = newHqOverride.companyCode.toUpperCase();
    this.hqOverrideService
      .createCompanyHqOverrideDetail(
        this.loggedInCompanyCode,
        this.loggedinEmpId,
        newHqOverride
      )
      .subscribe((data) => {
        this.spinnerShow = false;
        let message = AppStringConstants.HQ_OVERRIDE_UPDATE_SUCESS;
        message=message.replace("companyCode",data.companyCode)
        
        this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_SUCCESS,true);
        this.rowEditableList[index].editable =
        !this.rowEditableList[index].editable;
        this.scrollTop();
        setTimeout(()=> {
          this.showInfo(data)
         },1000)

      

      });
  }
  showInfo(data){
    if(data.hasStrategies){
      let message = AppStringConstants.HAS_STRATEGIES_INFO_MSG;
      message= message.replace('companyCode', data.companyCode);
      message= message.replace('planYearStart',  this.datePipe.transform(
        data.planYearStart,
        AppStringConstants.DATE_FORMAT
      ) );
      this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_INFO,true);
      this.scrollTop();
    }
  }
  addNewException(newException: any) {
    this.scrollTop();
  }
 
  handleSelectedCompanyChange(companyCode) {
    this.selectedCompanyCode = companyCode;
    this.companyCode = companyCode;
    this.getHqOverrideAttributes();
  }

  enableSaveButton(index) {
    if (this.rowEditableList[index])
      this.rowEditableList[index].saveButtonEditable = true;
  }
  disableSaveButton(index) {
    if (this.rowEditableList[index])
      this.rowEditableList[index].saveButtonEditable = false;
  }
  handlezipValueChange(event,hqOverride,index){
    this.enableSaveButton(index);
  }
  
 
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTopHeight =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTopHeight > 200) {
      this.fixed = true;
    } else {
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
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.hqOverrideAttributes = this.sort(this.hqOverrideAttributes, column, direction);
  }
  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  sort(
    exceptions: HqOverride[],
    column: string,
    direction: string
  ): HqOverride[] {
    const columnValue = this.companyHqOverrridesHeader.get(column);
    if (direction === '') {
      return [...exceptions].sort((a, b) => {
        const res = this.compare(a[this.companyHqOverrridesHeader.get(this.timestampColumn)], b[this.companyHqOverrridesHeader.get(this.timestampColumn)]);
        return -res;
      });
    } else {
      return [...exceptions].sort((a, b) => {
        const res = this.compare(a[columnValue], b[columnValue]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
