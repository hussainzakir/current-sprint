import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from './services/common.service';
import { filter, map } from 'rxjs/operators';

export declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ui-bss-admin';
  baseUrl = "";
  GA_TRACKING_ID: string;

  constructor(private commonService: CommonService, private router: Router) {
  }

  ngOnInit() {
    if (this.commonService && this.commonService.loadSession) {
      this.commonService.loadSession().then(() => {
        this.baseUrl = new URL(window.location.href).origin;
        this.addGAScript();
        if (this.GA_TRACKING_ID) {
          const empId = 'Id_' + this.commonService.getEmployeeId();
          const companyId = this.commonService.getCompanyId();

          gtag('config', this.GA_TRACKING_ID, {
            'custom_map': {
              'Dimension_CompanyId': 'Company_ID',
              'Dimension_EmployeeId': 'Employee_ID',
              'Dimension_PlanCount': 'Plan_Count',
            },
            'user_id': empId,
            'Company_ID': companyId,
            'Employee_ID': empId,
          });
        }
      });
    }
  }

  /** Add Google Analytics Script Dynamically */
  addGAScript() {
    for (const gaEnv in environment.GoogleAnalytics) {
      if (this.baseUrl.includes(gaEnv)) {
        this.GA_TRACKING_ID = environment.GoogleAnalytics[gaEnv].GA_ID;
        break;
      }
    }
    if (this.GA_TRACKING_ID) {
      let gtagScript: HTMLScriptElement = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.GA_TRACKING_ID;
      document.head.prepend(gtagScript);
      /** Disable automatic page view hit to fix duplicate page view count  **/

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        /** START : Code to Track Page View  */
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
        })
        /** END */
      });
    }
  }
}
