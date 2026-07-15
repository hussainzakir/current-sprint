import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { CommonService } from 'src/app/services/common.service';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { DeSelectionException } from 'src/app/models/deselection-exception';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { RowEditable } from 'src/app/models/rowEditable';

@Component({
  selector: 'app-deselection-exceptions',
  templateUrl: './plan-deselection-exception.component.html',
})
export class PlanDeselectionExceptionComponent implements OnInit {
  deSelectionTableHeaders: Map<any, any> = new Map<any, any>();
  exceptionsData: any[] = [];
  filterExchangeValue: any;
  selectedCompanyCode: string;
  selectedQuarter: any;
  approvers: any[] = new Array();
  planTypes: any[] = new Array();
  exceptionTypes: any[] = new Array();
  rowEditableList: any[] = new Array();
  exception: DeSelectionException;
  scrollTopHover: boolean;
  fixed: boolean;
  headerValues: any[] = new Array();
  dateFormatPattern: any;
  spinnerShow: boolean;
  bannerMessage: BannerMessage;
  success: any = AppStringConstants.TYPE_SUCCESS;
  timestampColumn: any = AppStringConstants.TIMESTAMP_COLUMN;
  exceptionAttributes: any;
  pageTitle: any = AppStringConstants.PLAN_DESELECTION_TITLE;
  exceptionsCloneData: DeSelectionException[] = new Array<DeSelectionException>();
  clearFlag: boolean;
  loggedinEmpId: string;
  loggedInCompanyCode: string;
  minDate: Date = AppStringConstants.MIN_DATE_DESELECTION_EXCEPTION;

  constructor(
    private exceptionService: ExcpetionService,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document: Document,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.deSelectionTableHeaders = AppStringConstants.DESELECTION_TABLE_HEADERS;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.getAllExceptions();
    this.getExceptionAttributes();
    this.headerValues = Array.from(this.deSelectionTableHeaders.keys());
    this.dateFormatPattern =
      '^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$';
    this.bannerMessage = new BannerMessage('', '', false);
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
            if (exception.exceptionId === 3) {
              exception.attributes.forEach((attribute) => {
                switch (attribute.attributeId) {
                  case 2:
                    this.approvers = attribute.values;
                    break;
                  case 4:
                    this.exceptionTypes = attribute.values;
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
      .getDeSelectionExceptions(this.loggedInCompanyCode, this.loggedinEmpId)
      .pipe(
        map((exceptionData) => {
          this.exceptionsData = this.sort(exceptionData, this.timestampColumn, '');
          this.exceptionsCloneData = JSON.parse(JSON.stringify(this.exceptionsData));
        })
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
            this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_ERROR, true);
          } else {
            let message = err.error.customMessage;
            this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_ERROR, true);
          }
        }
      );
  }
  // getAttributeName(attributeArray, attributeSearchValue) {
  //   if (attributeArray.find(({ attributeValue }) => attributeValue === attributeSearchValue))
  //     return attributeArray.find(({ attributeValue }) => attributeValue === attributeSearchValue)
  //       .name;
  // }
  createRowEditableList() {
    this.exceptionsData.forEach((element) => {
      let rowEditableObject: RowEditable = new RowEditable();
      rowEditableObject.editable = true;
      rowEditableObject.saveButtonEditable = false;
      this.rowEditableList.push(rowEditableObject);
    });
  }
  onEditClick(index, exceptionId) {
    if (this.rowEditableList[index].editable) {
      this.rowEditableList[index].editable = !this.rowEditableList[index].editable;
      this.cdref.detectChanges();
    } else {
      //refresh click
      this.rowEditableList[index].editable = !this.rowEditableList[index].editable;
      this.exceptionService
        .getDeselectionException(
          this.loggedInCompanyCode,
          this.loggedinEmpId,
          this.exceptionsData.find(({ id }) => id === exceptionId).id
        )
        .subscribe((exceptionNode) => {
          const ind = this.exceptionsData.findIndex((obj) => {
            if (obj.id === exceptionId) {
              return true;
            }
          });
          this.exceptionsData[ind] = exceptionNode;
          this.cdref.detectChanges();
        });
    }
  }
  getStartDate(event: MatDatepickerInputEvent<Date>, exceptionId, savebuttonEnableIndex) {
    this.exceptionsData.find(({ id }) => id === exceptionId).startDate = event.value;
    this.shallowCompareEnablingSave(
      this.exceptionsData.find(({ id }) => id === exceptionId),
      this.exceptionsCloneData.find(({ id }) => id === exceptionId),
      savebuttonEnableIndex
    );
  }
  getEndDate(event: MatDatepickerInputEvent<Date>, exceptionId, savebuttonEnableIndex) {
    this.exceptionsData.find(({ id }) => id === exceptionId).endDate = event.value;
    this.shallowCompareEnablingSave(
      this.exceptionsData.find(({ id }) => id === exceptionId),
      this.exceptionsCloneData.find(({ id }) => id === exceptionId),
      savebuttonEnableIndex
    );
  }
  handleApproverChange(approver, exceptionId, savebuttonEnableIndex) {
    if (this.approvers) {
      this.exceptionsData.find(({ id }) => id === exceptionId).approverId = approver;
      this.exceptionsData.find(({ id }) => id === exceptionId).approverName = this.approvers.find(
        ({ attributeValue }) => attributeValue === approver
      ).name;
      this.shallowCompareEnablingSave(
        this.exceptionsData.find(({ id }) => id === exceptionId),
        this.exceptionsCloneData.find(({ id }) => id === exceptionId),
        savebuttonEnableIndex
      );
    } else {
      this.disableSaveButton(savebuttonEnableIndex);
    }
  }
  // handlePlanTypeChange(planType, exceptionId, savebuttonEnableIndex) {
  //   if (this.planTypes) {
  //     this.exceptionsData.find(({ id }) => id === exceptionId).planType = planType;
  //     this.shallowCompareEnablingSave(
  //       this.exceptionsData.find(({ id }) => id === exceptionId),
  //       this.exceptionsCloneData.find(({ id }) => id === exceptionId),
  //       savebuttonEnableIndex
  //     );
  //   } else {
  //     this.disableSaveButton(savebuttonEnableIndex);
  //   }
  // }

  onUpdate(index, exceptionId) {
    let message = '';
    this.spinnerShow = true;
    this.disableSaveButton(index);
    let editedExceptionObject = this.exceptionsData.find(({ id }) => id === exceptionId);
    this.spinnerShow = true;
    this.exceptionService
      .editDeselectionException(this.loggedInCompanyCode, this.loggedinEmpId, editedExceptionObject)
      .pipe(
        map((returnedExceptionObject) => {
          Object.assign(
            this.exceptionsData.find(({ id }) => id === exceptionId),
            returnedExceptionObject
          );
        })
      )
      .subscribe(
        (_) => {
          this.rowEditableList[index].editable = !this.rowEditableList[index].editable;
          this.cdref.detectChanges();
          this.spinnerShow = false;
          message =
            'Plan Deselection Exception for ' +
            editedExceptionObject.companyName +
            ' has been successfully updated';
          this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_SUCCESS, true);
          this.exceptionsData = this.sort(this.exceptionsData, this.timestampColumn, '');
          this.exceptionsCloneData = JSON.parse(JSON.stringify(this.exceptionsData));
          this.scrollTop();
          let emptyString = '';
          this.handleSelectedExchangeChange(emptyString);
          this.handleSelectedQuarterChange(emptyString);
          this.handleSelectedCompanyChange(emptyString);
        },
        (err: HttpErrorResponse) => {
          if (err.status && (err.status === 401 || err.status === 403)) {
            this.spinnerShow = false;
            message = err.error._error.message;
            this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_ERROR, true);
            this.scrollTop();
          } else {
            this.spinnerShow = false;
            message = err.error.customMessage;
            this.bannerMessage = new BannerMessage(message, AppStringConstants.TYPE_ERROR, true);
            this.scrollTop();
          }
        }
      );
  }
  addNewException(newException: DeSelectionException) {
    let emptyString = '';
    this.handleSelectedExchangeChange(emptyString);
    this.handleSelectedQuarterChange(emptyString);
    this.handleSelectedCompanyChange(emptyString);
    this.clearFlag = true;
    let rowEditableObject: RowEditable = new RowEditable();
    rowEditableObject.editable = true;
    rowEditableObject.saveButtonEditable = false;
    this.rowEditableList.push(rowEditableObject);
    this.exceptionsData.push(newException);
    this.cdref.detectChanges();
    this.exceptionsData = this.sort(this.exceptionsData, this.timestampColumn, '');
    this.exceptionsCloneData = JSON.parse(JSON.stringify(this.exceptionsData));
    this.scrollTop();
  }
  handleNewExceptionBanner(bannerMessage: BannerMessage) {
    Object.assign(this.bannerMessage, bannerMessage);
  }
  handleSelectedExchangeChange(exchange) {
    this.filterExchangeValue = exchange;
  }
  handleSelectedQuarterChange(quarter) {
    this.selectedQuarter = quarter;
  }
  handleSelectedCompanyChange(companyCode) {
    this.selectedCompanyCode = companyCode;
  }

  enableSaveButton(index) {
    if (this.rowEditableList[index]) this.rowEditableList[index].saveButtonEditable = true;
  }
  disableSaveButton(index) {
    if (this.rowEditableList[index]) this.rowEditableList[index].saveButtonEditable = false;
  }
  shallowCompareEnablingSave(
    original: DeSelectionException,
    clone: DeSelectionException,
    savebuttonEnableIndex
  ) {
    if (this.shallowCompare(original, clone)) this.disableSaveButton(savebuttonEnableIndex);
    else this.enableSaveButton(savebuttonEnableIndex);
  }
  shallowCompare(original: DeSelectionException, clone: DeSelectionException) {
    if (original && clone && original !== null && clone !== null) {
      if (
        original.approverId === clone.approverId &&
        original.endDate === clone.endDate &&
        original.startDate === clone.startDate
      ) {
        return true;
      } else return false;
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTopHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
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
        header.direction = '';
      }
    });

    this.exceptionsData = this.sort(this.exceptionsData, column, direction);
  }
  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  sort(
    exceptions: DeSelectionException[],
    column: string,
    direction: string
  ): DeSelectionException[] {
    const columnValue = this.deSelectionTableHeaders.get(column);
    if (direction === '') {
      return [...exceptions].sort((a, b) => {
        const res = this.compare(
          a[this.deSelectionTableHeaders.get(this.timestampColumn)],
          b[this.deSelectionTableHeaders.get(this.timestampColumn)]
        );
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
