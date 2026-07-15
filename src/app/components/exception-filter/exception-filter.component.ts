import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BannerMessage } from 'src/app/models/bannerMessage';
import { AppStringConstants } from 'src/app/constants/AppStringConstants';
import { Company } from 'src/app/models/company';
import { Observable } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-exception-filter',
  templateUrl: './exception-filter.component.html'
})
export class ExceptionFilterComponent implements OnInit {
  @Input() 
  exceptionsData: any[];
  @Input()
  clearFlag: boolean;
  @Output() 
  selectedQuarterCodeEmittor = new EventEmitter();
  @Output() 
  selectedExchangeCodeEmittor = new EventEmitter();
  @Output() 
  selectedCompanyCodeEmittor = new EventEmitter();

  setClear: boolean;
  selectedExchange: any;
  filterExchangeValue: any;
  exchangeEntries: any;
  quarterEntries: any;
  selectedQuarter: any;
  exchanges: any[];
  bannerMessage: BannerMessage;
  companyValues: any[];
  selectedCompany: any;
  selectedCompanyCode: any;
  quarterAttribute: string;
  exchangeAttribute: string;
  initialselectedQuarterFlag  : boolean = false;
  selectedQuarterDefaulted : any;
  loggedinEmpId: string;
  loggedInCompanyCode: string;


  constructor(private exceptionService: ExcpetionService, private commonService: CommonService) { }

  ngOnInit() {
    this.setClear = false;
    this.quarterAttribute = AppStringConstants.QUARTER_COMBOBOX_VALUE;
    this.exchangeAttribute = AppStringConstants.EXCHANGE_COMBOBOX_VALUE;
    this.loggedinEmpId = this.commonService.getEmployeeId();
    this.loggedInCompanyCode = this.commonService.getCompanyId();
    this.getAllExchanges();
  }
  ngOnChanges(){
    if(this.clearFlag){
      this.onClearClick();
      let company = new Company;
      company.companyCode='';
      company.companyName='';
      this.selectedCompany = undefined;
    }
  }
  handleExchangeValue(exchangeValue) {
    this.setClear = false;
    this.selectedExchange = exchangeValue.toString();
    this.filterExchangeValue = this.selectedExchange;
    this.selectedExchangeCodeEmittor.emit(this.filterExchangeValue);
    this.exchangeEntries.forEach(exchange => {
      if (exchange.product === this.selectedExchange) {
        this.quarterEntries = exchange.quarters;
        this.selectedQuarterDefaulted = this.quarterEntries[0];
        this.initialselectedQuarterFlag = true;
        this.handleQuarterValue(this.selectedQuarterDefaulted, true);
      }
    });

  }
  handleQuarterValue(quarterValue, defaultFlag) {
    if(!defaultFlag){this.selectedQuarterDefaulted = null;
        }
    this.selectedQuarter = quarterValue.toString();
    this.selectedQuarterCodeEmittor.emit(this.selectedQuarter);
  }
  getAllExchanges() {
    this.exceptionService.getAllExchanges(this.loggedInCompanyCode, this.loggedinEmpId).pipe(map((exchangeData) => {
      this.exchanges=[];
      this.exchangeEntries = exchangeData;
      this.exchangeEntries.forEach(exchange => {
        this.exchanges.push(exchange.product);
      });
    })).subscribe(_ => {
    },
    (err:HttpErrorResponse)=>{
      let message = err.error.customMessage;
      this.bannerMessage = new BannerMessage(message,AppStringConstants.TYPE_ERROR,true);
    });
  }
  onClearClick() {
    this.selectedExchange = '';
    this.filterExchangeValue = '';
    this.selectedQuarter = '';
    this.setClear = true;
    this.selectedExchangeCodeEmittor.emit(this.filterExchangeValue);
    this.selectedQuarterCodeEmittor.emit(this.selectedQuarter);
  }

  companyFormatter = (result: Company) => `${result.companyName!==''?result.companyName:''} ${result.companyCode!=='' ? '('+result.companyCode+')':''}`;


  searchCompany = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(term => {
        if (term.length !== 0) {
          this.companyValues = [];
          const _this = this;
          if (this.exceptionsData?.length) {
            this.exceptionsData.forEach(function (item, index) {
              if (item.companyCode.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                if (_this.companyValues.filter(e => e.companyCode === _this.exceptionsData[index].companyCode).length === 0) {
                  let company = new Company;
                  company.companyCode = _this.exceptionsData[index].companyCode;
                  company.companyName = _this.exceptionsData[index].companyName;
                  _this.companyValues.push(company);
                }
              }
            });
            return _this.companyValues;
          }
        }
      }
    ));

  onSelectCompany(event: NgbTypeaheadSelectItemEvent) {
    this.selectedCompany = event.item;
    if (this.selectedCompany !== undefined) {
      this.selectedCompanyCode = this.selectedCompany.companyCode;
      this.selectedCompanyCodeEmittor.emit(this.selectedCompanyCode);
    }
  }

  onCompanyChange(event: any) {
    if (event !== this.selectedCompany || event === "" || event === undefined) {
      this.selectedCompanyCode = '';
      this.selectedCompanyCodeEmittor.emit(this.selectedCompanyCode);
    }
  }
  
}
