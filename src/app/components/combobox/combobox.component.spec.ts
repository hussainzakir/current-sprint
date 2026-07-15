import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComboboxComponent } from './combobox.component';

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboboxComponent ]
    }).overrideComponent(ComboboxComponent, {
      
    })
    .compileComponents().then(() =>{
      fixture = TestBed.createComponent(ComboboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

    it('should create', () => {
    expect(component).toBeTruthy();    
    });
    it('should create - on ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showList).toEqual(false);
    expect(component.itemSelected).toEqual(false);
    });
    it('should create - on ngDoCheck()', () => {
    component.cleared = true;
    component.ngDoCheck();
    expect(component.cleared).toEqual(false);
    expect(component.itemSelected).toEqual(false);
    expect(component.initialSelected).toEqual(false);
    });
    it('should create - on toggleComboList() component.showList = true', () => {
    component.showList = true;
    component.toggleComboList();
    expect(component.showList).toEqual(false);
    });
    it('should create - on toggleComboList() component.showList = false', () => {
    component.showList = false;
    component.toggleComboList();
    expect(component.showList).toEqual(true);
    });
    it('should create - onClick() event = new MouseEvent(click)', () => {
    component.showList = true;
    let event = new MouseEvent('click');
    component.onClick(event);
    expect(component.showList).toEqual(false);
    });
    it('should create - sendOGValue() dropdownvalue', () => {
      let dropdownvalue = 'ABC';
      spyOn(component.valueEmittor, 'emit');
      component.sendOGValue(dropdownvalue);
      fixture.detectChanges();
      expect(component.valueEmittor.emit).toHaveBeenCalled();
      expect(component.valueEmittor.emit).toHaveBeenCalledWith('ABC');
      expect(component.initialSelected).toEqual(true);
      expect(component.dropdownLabel).toEqual(dropdownvalue.toString());
      expect(component.showList).toEqual(false);
      expect(component.itemSelected).toEqual(true);
      });
      it('should create - sendAttrValue() dropdownvalue', () => {
        let dropdownvalue: any = new Object();
        spyOn(component.valueEmittor, 'emit');
        dropdownvalue.attributeValue = 'ABC';
        dropdownvalue.name = 'ABC Holdings LTD';
        component.sendAttrValue(dropdownvalue);
        fixture.detectChanges();
        expect(component.valueEmittor.emit).toHaveBeenCalled();
        expect(component.valueEmittor.emit).toHaveBeenCalledWith('ABC');
        expect(component.initialSelected).toEqual(true);
        expect(component.dropdownLabel).toEqual(dropdownvalue.name.toString());
        expect(component.showList).toEqual(false);
        expect(component.itemSelected).toEqual(true);
        });
});
