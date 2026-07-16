/// <reference types="jasmine" />

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewLifeDiExceptionComponent } from './new-life-di-exception.component';
import { ExcpetionService } from 'src/app/services/excpetion.service';
import { CommonService } from 'src/app/services/common.service';
import { of } from 'rxjs';

describe('NewLifeDiExceptionComponent', () => {
  let component: NewLifeDiExceptionComponent;
  let fixture: ComponentFixture<NewLifeDiExceptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NewLifeDiExceptionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ExcpetionService,
          useValue: {
            getAllCompanies: jasmine.createSpy('getAllCompanies').and.returnValue(of({ L13: 'M Comp 1831 Vend Inc.' })),
          },
        },
        {
          provide: CommonService,
          useValue: {
            getEmployeeId: jasmine.createSpy('getEmployeeId').and.returnValue('00001234567'),
            getCompanyId: jasmine.createSpy('getCompanyId').and.returnValue('001'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLifeDiExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate company details and existing band values from matching exception', () => {
    component.exceptions = [
      {
        companyCode: 'L13',
        companyName: 'M Comp 1831 Vend Inc.',
        assignedLifeBand: 2,
        assignedDisabilityBand: 3,
      },
    ];
    component.newException = { companyCode: 'L13' } as any;

    component.getCompany();

    expect(component.newException.companyName).toBe('M Comp 1831 Vend Inc.');
    expect(component.newException.assignedLifeBand).toBe(2);
    expect(component.newException.assignedDisabilityBand).toBe(3);
  });
});
