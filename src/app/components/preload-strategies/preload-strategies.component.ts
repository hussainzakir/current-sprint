import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { HtmlLabels } from 'src/app/constants/HtmlLabels';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { PreLoadStrategies } from 'src/app/models/pre-load-strategies';
import { PreloadOption } from 'src/app/models/preloadOption';
import { CommonService } from 'src/app/services/common.service';
import { PreloadStrategiesService } from 'src/app/services/preload-strategies.service';



@Component({
  selector: 'app-preload-strategies',
  templateUrl: './preload-strategies.component.html',
  styleUrls: ['./preload-strategies.component.scss']
})
export class PreloadStrategiesComponent implements OnInit {
  selected = 0;
  pageTitle=AppStringConstants.PRELOAD_PAGE_TITLE;
  spinnerShow=false;
  preloadStatus:any;
  headerColumn: string[] = AppStringConstants.HEADER_COLUMN;
  headerValues : string[] = AppStringConstants.HEADER_VALUES;
  fixed: boolean;
  scrollTopHover: boolean;
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  
  preloadStrategiesLabel=HtmlLabels.preloadStrategies;

  loggedinEmpId: string;
  selectedQutater: string = null;
  companyCode: string = null;
  loggedInCompanyCode: string = '1';
  preloadPlanYearOption: PreloadOption[] = [];
  processStatusData: PreLoadStrategies[] = [];
  bannerMessage: BannerMessage;
  responceMsg: string;
  preloadOpstion: PreloadOption;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private preloadStrategiesService: PreloadStrategiesService,
    private commonService: CommonService, @Inject(DOCUMENT) private document: Document,
    private cdref: ChangeDetectorRef) { }


  preloadOpstions: PreloadOption[] = AppStringConstants.PRELOAD_OPSTIONS;
  ngOnInit(): void {
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.getPreloadQuater();
    this.getPreloadStratgyStatus();
    this.bannerMessage =  new BannerMessage('','',false);

  }
  handlePreloadOption(event){
    this.selected=event;
  }
  getPreloadQuater() {
    this.preloadStrategiesService.getAllQuater(this.loggedInCompanyCode, this.loggedinEmpId).subscribe(data => {
      this.setQuaterList(data)
      this.cdref.detectChanges();
      this.bannerMessage = new BannerMessage(AppStringConstants.PRELOAD_SUCCESS_MSG,AppStringConstants.TYPE_SUCCESS,true);

    },
    (err: HttpErrorResponse) => {
      this.errorHandling(err,AppStringConstants.PRELOAD_FAIL_MSG, AppStringConstants.TYPE_CACEL);
    });
  }

  setQuaterList(quaterList) {
    quaterList.forEach((data, index) => {
      let value = data.peoId + "/" + data.oeQuarter + "/" + this.loggedInCompanyCode;
      let vueValue = data.benExchng + "-" + data.oeQuarter + "-" + data.planYearStart;

      this.preloadPlanYearOption.push({ attributeValue: value, name: vueValue });
    });

  }
  getPreloadStratgyStatus() {
    this.preloadStrategiesService.getAllPreloadStrategiesStatus(this.loggedInCompanyCode, this.loggedinEmpId).subscribe(data => {
      this.setStatus(data)
      this.processStatusData = data;
      this.cdref.detectChanges();
      this.dataSource = new MatTableDataSource<Element>(data);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.bannerMessage = new BannerMessage(AppStringConstants.PRELOAD_SUCCESS_MSG,AppStringConstants.TYPE_SUCCESS,true);

    },
      (err: HttpErrorResponse) => {
        this.errorHandling(err, AppStringConstants.PRELOAD_FAIL_MSG, AppStringConstants.TYPE_CACEL);

      });
  }
  setStatus(data){
    data.forEach(element => {
        let processStatus =element.status;
        switch (processStatus) {

          case AppStringConstants.PROCESS_STATUS_NEW:
            element.status= AppStringConstants.PRELOAD_STATUS[0];
            break;
          case AppStringConstants.PROCESS_STATUS_INPROGRESS:
            element.status= AppStringConstants.PRELOAD_STATUS[1];
            break;
      
          case AppStringConstants.PROCESS_STATUS_PROCESSED:
            element.status= AppStringConstants.PRELOAD_STATUS[2];
            break;
          case AppStringConstants.PROCESS_STATUS_FAILED:
            element.status= AppStringConstants.PRELOAD_STATUS[3];
            break;
          }
    });
  }
  handleQuaterSelection(selectedValue){
    this.selectedQutater=selectedValue;
  }
  preloadStrategies() {
    if (this.selected == 2 && this.companyCode != null) {
      let companyCodeList = this.companyCode.split(",");
      companyCodeList= companyCodeList.map(Function.prototype.call, String.prototype.trim);
      this.preloadStrategiesService.preloadStrategiesByCompanyCode(this.loggedInCompanyCode,
        this.loggedinEmpId, companyCodeList).subscribe(data => {
          this.preloadStatus=data;
          this.getPreloadStratgyStatus();
        },
          (err: HttpErrorResponse) => {
            this.errorHandling(err, AppStringConstants.PRELOAD_FAIL_MSG, AppStringConstants.TYPE_CACEL);

          });
    } else if (this.selected == 1) {
      this.preloadStrategiesService.preloadStrategiesByQuater(this.loggedInCompanyCode,
        this.loggedinEmpId, this.selectedQutater).subscribe(data => {
          this.getPreloadStratgyStatus();
          this.preloadStatus=data;

        },
          (err: HttpErrorResponse) => {
            this.errorHandling(err, AppStringConstants.PRELOAD_FAIL_MSG, AppStringConstants.TYPE_CACEL);

          });
    }  

  }
  refreshStatus() {
    this.getPreloadStratgyStatus();
  }
  errorHandling(err, msg, action) {
      this.bannerMessage = new BannerMessage(msg, AppStringConstants.TYPE_ERROR, true);
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
}
