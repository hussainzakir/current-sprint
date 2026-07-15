import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ChangeDetectorRef,
} from "@angular/core";
import { ExcpetionService } from "src/app/services/excpetion.service";
import { CommonService } from "src/app/services/common.service";
import { AppStringConstants } from "src/app/constants/AppStringConstants";
import { map } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import {
  NgbdSortableHeader,
  SortEvent,
} from "src/app/directives/sortable.directive";
import { BannerMessage } from "src/app/models/bannerMessage";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { RowEditable } from "src/app/models/rowEditable";

@Component({
  selector: "app-life-disability-band-exceptions",
  templateUrl: "./life-disability-band-exceptions.component.html",
  styleUrls: ["./life-disability-band-exceptions.component.scss"],
})
export class LifeDisabilityBandExceptionsComponent implements OnInit {
  bandOptions: string[] = AppStringConstants.LIFE_DISABILITY_BANDS;
  lifeBandTableHeaders: Map<any, any> = new Map<any, any>();
  overrideData: any[] = [];
  filterExchangeValue: any;
  selectedCompanyCode: string;
  selectedQuarter: any;
  approvers: any[] = new Array();
  rowEditableList: any[] = new Array();
  scrollTopHover: boolean;
  fixed: boolean;
  headerValues: any[] = new Array();
  spinnerShow: boolean;
  bannerMessage: BannerMessage;
  success: any = AppStringConstants.TYPE_SUCCESS;
  timestampColumn: any = AppStringConstants.TIMESTAMP_COLUMN;
  exceptionAttributes: any;
  pageTitle: any = AppStringConstants.LIFE_DISABILITY_BAND_EXCEPTIONS_TITLE;
  noResultsLabel: string = "No Results found";
  actionsLabel: string = "Actions";
  overrideDataClone: any[] = new Array();
  clearFlag: boolean;
  loggedinEmpId: string;
  loggedInCompanyCode: string;

  constructor(
    private readonly exceptionService: ExcpetionService,
    private readonly commonService: CommonService,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly cdref: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.lifeBandTableHeaders =
      AppStringConstants.LIFE_DISABILITY_BAND_TABLE_HEADERS;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.headerValues = Array.from(this.lifeBandTableHeaders.keys());
    this.bannerMessage = new BannerMessage("", "", false);
    this.getExceptionAttributes();
    this.getAllExceptions();
  }

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  getExceptionAttributes() {
    this.exceptionService
      .getExceptionAttributes(this.loggedInCompanyCode, this.loggedinEmpId)
      .pipe(
        map((exceptionAttributes) => {
          this.exceptionAttributes = exceptionAttributes;
        })
      )
      .subscribe(
        (_) => {
          this.approvers = [];
          this.exceptionAttributes.forEach((exception) => {
            if (exception.exceptionId === 2) {
              exception.attributes.forEach((attribute) => {
                switch (attribute.attributeId) {
                  case 2:
                    this.approvers = attribute.values;
                    break;
                }
              });
            }
          });
        },
        (err: HttpErrorResponse) => {
          if (err.status && (err.status === 401 || err.status === 403)) {
            let message = err.error._error.message;
            this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_ERROR, true);
          } else {
            let message = err.error.customMessage;
            this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_ERROR, true);
          }
        }
      );
  }

  getAllExceptions() {
    this.spinnerShow = true;
    this.exceptionService
      .getAllLifeAndDisabilityOverrideExceptions(
        this.loggedInCompanyCode,
        this.loggedinEmpId,
      )
      .pipe(
        map((exceptionData) => {
          this.overrideData = this.sort(
            exceptionData,
            this.timestampColumn,
            "",
          );
          this.overrideDataClone = JSON.parse(
            JSON.stringify(this.overrideData),
          );
        }),
      )
      .subscribe(
        (_) => {
          this.createRowEditableList();
          this.cdref.detectChanges();
          this.spinnerShow = false;
        },
        (err: HttpErrorResponse) => {
          if (err.status && (err.status === 401 || err.status === 403)) {
            let message = err.error._error.message;
            this.bannerMessage = new BannerMessage(
              message,
              AppStringConstants.TYPE_ERROR,
              true,
            );
          } else {
            let message = err.error.customMessage;
            this.bannerMessage = new BannerMessage(
              message,
              AppStringConstants.TYPE_ERROR,
              true,
            );
          }
        },
      );
  }

  createRowEditableList() {
    this.rowEditableList = new Array();
    for (let i = 0; i < this.overrideData.length; i++) {
      let rowEditable = new RowEditable();
      rowEditable.editable = true;
      rowEditable.saveButtonEditable = false;
      this.rowEditableList.push(rowEditable);
    }
  }

  handleSelectedQuarterChange(event: any) {
    this.selectedQuarter = event;
  }

  handleSelectedExchangeChange(event: any) {
    this.filterExchangeValue = event;
  }

  handleSelectedCompanyChange(event: any) {
    this.selectedCompanyCode = event;
  }

  handleNewExceptionBanner(event: any) {
    this.bannerMessage = event;
  }

  addNewException(event: any) {
    this.overrideData.unshift(event);
    this.overrideDataClone = JSON.parse(JSON.stringify(this.overrideData));
    this.createRowEditableList();
  }

  private hasIndex(index: any): boolean {
    return index !== null && index !== undefined;
  }

  getStartDate(event: MatDatepickerInputEvent<any>, id: any, index?: any) {
    let isRowModified = false;
    if (!this.hasIndex(index) || !event.value) return;

    this.overrideData[index].startDate = event.value;
    isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  getEndDate(event: MatDatepickerInputEvent<any>, id: any, index?: any) {
    let isRowModified = false;
    if (!this.hasIndex(index) || !event.value) return;

    this.overrideData[index].endDate = event.value;
    isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  handleApproverChange(event: any, id: any, index: any) {
    if (!this.hasIndex(index)) return;
    this.overrideData[index].approverName = event;
    let isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  handleLifeBandChange(event: any, id: any, index: any) {
    if (!this.hasIndex(index)) return;
    this.overrideData[index].assignedLifeBand = event;
    let isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  handleOverrideLifeBandChange(event: any, id: any, index: any) {
    if (!this.hasIndex(index)) return;
    this.overrideData[index].overrideLifeBand = event;
    let isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  handleDisabilityBandChange(event: any, id: any, index: any) {
    if (!this.hasIndex(index)) return;
    this.overrideData[index].assignedDisabilityBand = event;
    let isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  handleOverrideDisabilityBandChange(event: any, id: any, index: any) {
    if (!this.hasIndex(index)) return;
    this.overrideData[index].overrideDisabilityBand = event;
    let isRowModified = this.checkRowModification(index);
    this.rowEditableList[index].saveButtonEditable = isRowModified;
  }

  checkRowModification(index: any): boolean {
    if (!this.hasIndex(index)) return false;
    if (
      this.overrideData[index].startDate !==
        this.overrideDataClone[index].startDate ||
      this.overrideData[index].endDate !==
        this.overrideDataClone[index].endDate ||
      this.overrideData[index].approverName !==
        this.overrideDataClone[index].approverName ||
      this.overrideData[index].assignedLifeBand !==
        this.overrideDataClone[index].assignedLifeBand ||
      this.overrideData[index].overrideLifeBand !==
        this.overrideDataClone[index].overrideLifeBand ||
      this.overrideData[index].assignedDisabilityBand !==
        this.overrideDataClone[index].assignedDisabilityBand ||
      this.overrideData[index].overrideDisabilityBand !==
        this.overrideDataClone[index].overrideDisabilityBand
    ) {
      return true;
    }
    return false;
  }

  onEditClick(index: any, id: any) {
    if (!this.hasIndex(index)) return;
    this.rowEditableList[index].editable =
      !this.rowEditableList[index].editable;
  }

  onUpdate(index: any, id: any) {
    if (!this.hasIndex(index)) return;
    this.spinnerShow = true;
    setTimeout(() => {
      this.rowEditableList[index].editable = true;
      this.rowEditableList[index].saveButtonEditable = false;
      this.overrideDataClone[index] = JSON.parse(
        JSON.stringify(this.overrideData[index]),
      );
      this.bannerMessage = new BannerMessage(
        "Exception Updated Successfully",
        AppStringConstants.TYPE_SUCCESS,
        true,
      );
      this.spinnerShow = false;
    }, 500);
  }

  sort(data: any[], sortBy: any, sortByDirection: any) {
    return data.sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return dateB - dateA;
    });
  }

  onSort(event: SortEvent) {
    const { column, direction } = event;
    if (direction === "" || column === "") {
      this.overrideData = this.sort(
        this.overrideData,
        this.timestampColumn,
        "",
      );
    } else {
      this.overrideData = [...this.overrideData].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === "asc" ? res : -res;
      });
    }
  }

  compare(a: string | number, b: string | number) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let scrollTopHover = document.querySelector(".exceptionTable");
    if (scrollTopHover) {
      this.scrollTopHover = true;
    }
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.fixed = false;
  }
}
