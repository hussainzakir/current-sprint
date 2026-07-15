import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyHqOverridesComponent } from './components/company-hq-overrides/company-hq-overrides.component';
import { ExceptionsComponent } from './components/exceptions/exceptions.component'
import { PlanDeselectionExceptionComponent } from './components/plan-deselection-exception/plan-deselection-exception.component';
import { PlanAttributesComparisionComponent } from './components/plan-attributes-comparision/plan-attributes-comparision.component';
import { PlantypeExceptionsComponent } from './components/plantype-exceptions/plantype-exceptions.component';
import { PreloadStrategiesComponent } from './components/preload-strategies/preload-strategies.component';
import { LifeDisabilityBandExceptionsComponent } from './components/life-disability-band-exceptions/life-disability-band-exceptions.component';

const routes: Routes = [
  {
    path: "minfund-exceptions",
    component: ExceptionsComponent,
    data: { animation: "" },
  },
  {
    path: "preload-strategies",
    component: PreloadStrategiesComponent,
    data: { animation: "" },
  },
  {
    path: "plantype-exceptions",
    component: PlantypeExceptionsComponent,
    data: { animation: "" },
  },
  {
    path: "plan-deselection-exceptions",
    component: PlanDeselectionExceptionComponent,
    data: { animation: "" },
  },
  {
      path: "plan-attributes-comparison",
      component: PlanAttributesComparisionComponent,
      data: { animation: "" },
  },
  {
    path: "company-hq-overrides",
    component: CompanyHqOverridesComponent,
    data: { animation: "" },
  },
  {
    path: "life-disability-band-exceptions",
    component: LifeDisabilityBandExceptionsComponent,
    data: { animation: "" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
