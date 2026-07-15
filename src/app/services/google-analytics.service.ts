import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
 
export declare const gtag: Function;
 
@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {
    baseUrl = new URL(window.location.href).origin;
    public eventEmitter(
        eventName: string,
        eventValue: any
    ) {
        for (const gaEnv in environment.GoogleAnalytics) {
            if (this.baseUrl.includes(gaEnv)) {
                eventValue['send_to'] = environment.GoogleAnalytics[gaEnv].GA_ID;
                break;
            }
        }
        if (eventValue['send_to']) {
            gtag('event', eventName,
                eventValue
            );
        }
    }
}