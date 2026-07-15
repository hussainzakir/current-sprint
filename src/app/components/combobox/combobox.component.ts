import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter , OnChanges } from '@angular/core';
import{ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class ComboboxComponent implements OnInit,OnChanges{
@Input() data = [];
showList: boolean;
@Output() valueEmittor = new EventEmitter();
dropdownLabel: any;
itemSelected: boolean;
disableFlag: boolean;
@Input() valueAttribute;
@Input() disableComboBox;
@Input() initialSelected;
@Input() defaultValue;
@Input() cleared;
@Input() comboType;
items: any = [];
valueAttr:any = '';
combotype: any;

constructor(private _eref: ElementRef, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.showList = false;
    this.itemSelected = false;
    }
  ngOnChanges() {
  this.items = this.data;
  this.valueAttr = this.valueAttribute;
  this.disableFlag= this.disableComboBox;
  this.combotype = this.comboType;
   }
   ngAfterViewInit() {
     this.cd.detectChanges();
  }  
  ngDoCheck(){
    if(this.cleared){
      this.cleared = false;
      this.itemSelected = false;
      this.initialSelected =  false;
    }
  }
  toggleComboList() {
    this.showList = !this.showList;
  }
  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target))
      this.showList = false;
   }
   sendOGValue(dropdownvalue){
      this.itemSelected = true;
      this.initialSelected = true;
      this.valueEmittor.emit(dropdownvalue);
      this.dropdownLabel =  dropdownvalue.toString();
      this.showList = false;
   }
   sendAttrValue(dropdownAttr){
    this.itemSelected = true;
    this.initialSelected = true;
    this.valueEmittor.emit(dropdownAttr.attributeValue);
    this.dropdownLabel =  dropdownAttr.name.toString();
    this.showList = false;
 }


  
}