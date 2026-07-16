import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule }  from '@ng-bootstrap/ng-bootstrap';
import { ComboboxComponent } from './components/combobox/combobox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ExceptionsComponent } from './components/exceptions/exceptions.component';
import { FilterByPipe } from './pipes//filter-by.pipe';
import { NewExceptionComponent } from './components/new-exception/new-exception.component';
import { CustomMinValidatorDirective } from './directives/custom-min-validator.directive';
import { CustomMaxValidatorDirective } from './directives/custom-max-validator.directive';
import { NgbdSortableHeader } from './directives/sortable.directive';
import { TriNetCommonModule } from '@trinet/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ExceptionFilterComponent } from './components/exception-filter/exception-filter.component';
import { PlantypeExceptionsComponent } from './components/plantype-exceptions/plantype-exceptions.component';
import { NewPlantypeExceptionComponent } from './components/new-plantype-exception/new-plantype-exception.component';
import { CookieService, CookieOptionsProvider, CookieModule } from 'ngx-cookie';
import { CommonService } from './services/common.service';
import { PreloadStrategiesComponent } from './components/preload-strategies/preload-strategies.component';
import { AppMaterialModule } from './material.module';
import { CompanyHqOverridesComponent } from './components/company-hq-overrides/company-hq-overrides.component';
import { NewCompanyHqOverridesComponent } from './components/new-company-hq-overrides/new-company-hq-overrides.component';
import { DatePipe } from '@angular/common';
import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';
import { PlanDeselectionExceptionComponent } from './components/plan-deselection-exception/plan-deselection-exception.component';
import { PlanAttributesComparisionComponent } from './components/plan-attributes-comparision/plan-attributes-comparision.component';
import { LifeDisabilityBandExceptionsComponent } from './components/life-disability-band-exceptions/life-disability-band-exceptions.component';
import { NewLifeDiExceptionComponent } from './components/new-life-di-exception/new-life-di-exception.component';

export function BASessionFactory(commonService: CommonService) {
  return () => commonService.loadSession();
}

@NgModule({
  declarations: [
    AppComponent,
    ComboboxComponent,
    ExceptionsComponent,
    FilterByPipe,
    NewExceptionComponent,
    CustomMinValidatorDirective,
    CustomMaxValidatorDirective,
    NgbdSortableHeader,
    ExceptionFilterComponent,
    PlantypeExceptionsComponent,
    NewPlantypeExceptionComponent,
    PreloadStrategiesComponent,
    CompanyHqOverridesComponent,
    NewCompanyHqOverridesComponent,
    WarningDialogComponent,
    PlanDeselectionExceptionComponent,
    PlanAttributesComparisionComponent,
    LifeDisabilityBandExceptionsComponent,
    NewLifeDiExceptionComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    TriNetCommonModule,
    CookieModule.forRoot()
    ],
  providers: [CommonService,MatDatepickerModule,MatFormFieldModule,MatInputModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    CookieService, CookieOptionsProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: BASessionFactory,
      deps: [CommonService],
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
