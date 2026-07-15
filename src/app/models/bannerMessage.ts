export class BannerMessage {
    public bannerMessageText: any;
    public bannerMessageShow: any;
    public bannerMessageType: any;
    constructor( bannerMessageText: any, bannerMessageType: any, bannerMessageShow: boolean){
        this.bannerMessageShow = bannerMessageShow;
        this.bannerMessageText = bannerMessageText;
        this.bannerMessageType = bannerMessageType;
    }
 }