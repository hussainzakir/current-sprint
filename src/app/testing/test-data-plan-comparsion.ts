export class PlanComparsionTestData {

    public static readonly COMPANY_NAME_RESPONSE = {
        data: {
            exchange: "TriNet II",
            quarter: "SM",
            productLine: "DFLT",
            productId: null,
            benAdminVendor: null,
            benefitStartDate: "10/01/2017",
            compSetupDate: "08/09/2017",
            planYearDates: [
                { startDate: "04/01/2022", endDate: "03/31/2023", planYear: "Current" },
                { startDate: "04/01/2023", endDate: "03/31/2024", planYear: "Future" }
            ],
            company: {
                code: "SSO",
                hqState: "IL",
                name: "Govoulaudi Group ltd."
            },
            fundingServiceProvider: {
                service: "BSS",
                uri: "/ui-bss-cb",
                cssUri: "/ui-bss-cb",
                fundingOpen: "N",
                fundingOpenDate: "01/04/2022",
                fundingCloseDate: "03/21/2022"
            },
            isNewCompany: "false"
        }
    };

    public static readonly CURRENT_YEAR_OR_ALL_PLANS = {
        data: [
            { planId: "002FFE", offerType: "10", planName: "Aetna Choice PPO HDHP 3 IL" },
            { planId: "002FF6", offerType: "10", planName: "Aetna Choice PPO HDHP 3 IN" }
        ]
    };

    public static readonly MAPPED_PLANS = {
        data: [
            { planId: 'MD22222', parentId: '0071BV', offerType: 'medical', planName: 'Aetna PPO 1000 NTL' },
            { planId: 'MD33333', parentId: '0071BW', offerType: 'medical', planName: 'Aetna PPO 1000' }
        ]
    };

    public static readonly PLAN_SELECTION_FORM = {
        currentPlan: { planId: "002FFE", offerType: "10", planName: "Aetna Choice PPO HDHP 3 IL" },
        mappedPlans: PlanComparsionTestData.MAPPED_PLANS.data,
        allPlans: PlanComparsionTestData.CURRENT_YEAR_OR_ALL_PLANS.data
    };

}