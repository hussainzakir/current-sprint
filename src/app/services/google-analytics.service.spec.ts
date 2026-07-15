import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { GoogleAnalyticsService } from "./google-analytics.service";

describe("GoogleAnalyticsService", () => {
    let service: GoogleAnalyticsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GoogleAnalyticsService],
        });
        window['gtag'] = () => { };
        service = TestBed.inject(GoogleAnalyticsService);
    });

    it("should call eventEmitter", () => {
        let params = {};
        service.baseUrl = 'bp1-platform-sl.dev01.trinet.internal';
        service.eventEmitter('', params);
        expect(params['send_to']).toEqual(environment.GoogleAnalytics['bp1-platform-sl.dev01.trinet.internal'].GA_ID);
    });
});