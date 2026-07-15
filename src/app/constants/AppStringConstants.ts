import { PreloadOption } from '../models/preloadOption';

export class AppStringConstants {
  public static PROCESS_STATUS_FAILED = 'F';
  public static PROCESS_STATUS_PROCESSED = 'P';
  public static COMPANY_CODE_ERROR = 'Enter a valid company code';
  public static COMPANY_CODE_EXIST_ERROR = 'companyCode already exist .';
  public static COMPANY_CODE_NOT_EXIST_ERROR = 'companyCode not exist .';

  public static HQ_OVERRIDE_CREATE_SUCESS = 'Override for companyCode created sucessfully ';
  public static HQ_OVERRIDE_UPDATE_SUCESS = 'Override for companyCode updated sucessfully ';
  public static HQ_OVERRIDE_DELETE_SUCESS = 'Override for companyCode deleted sucessfully ';
  public static HQ_OVERRIDE_CLONE_SUCESS = 'Override for companyCode cloned sucessfully ';

  public static PROCESS_STATUS_INPROGRESS = 'I';
  public static PROCESS_STATUS_NEW = 'N';
  public static FUND_TYPES: any[] = ['CFPCT', 'BFPCT', 'FLT'];
  public static CFPCT = 'Covered Person Percent';
  public static BFPCT = 'Base Plan Percent';
  public static FLAT = 'FLAT';
  public static COMPANY_ERROR_MSG = 'Enter a valid Company Code';
  public static CREATE_ERROR_OVERIDE_MSG = 'Please Edit Overide Details , Data Already Exists';
  public static CREATE_ERROR_REQUIRED_FEILD_MSG = 'Please enter all required field';

  public static HAS_STRATEGIES_INFO_MSG =
    'Company companyCode already has strategies for the plan year beginning on planYearStart. Contact Tier 2 support to reset the company if needed.';
  public static EXCHANGE_COMBOBOX_VALUE = 'exchange';
  public static QUARTER_COMBOBOX_VALUE = 'quarter';
  public static PLANYEAR_COMBOBOX_VALUE = 'planYearDate';
  public static ALL = 'all';
  public static PLAN_TYPES: any = new Map([
    ['10', 'Medical'],
    ['11', 'Dental'],
    ['14', 'Vision'],
  ]);
  public static EXCEPTION_TYPES: any = ['PCT', 'FLT', 'NONE'];
  public static EXCEPTION_TABLE_HEADERS = new Map([
    ['Company ID', 'companyCode'],
    ['Company Name', 'companyName'],
    ['Start Date', 'startDate'],
    ['End Date', 'endDate'],
    ['Approver', 'approverName'],
    ['Plan Type', 'planType'],
    ['Exception Type', 'minFundValType'],
    ['Exception Value', 'minFundValue'],
    ['TimeStamp', 'createTime'],
  ]);
  public static DESELECTION_TABLE_HEADERS = new Map([
    ['Company ID', 'companyCode'],
    ['Company Name', 'companyName'],
    ['Start Date', 'startDate'],
    ['End Date', 'endDate'],
    ['Approver', 'approverName'],
    ['TimeStamp', 'createTime'],
  ]);
  public static PLANTYPE_EXCEPTION_TABLE_HEADERS = new Map([
    ['Company ID', 'companyCode'],
    ['Company Name', 'companyName'],
    ['Start Date', 'startDate'],
    ['End Date', 'endDate'],
    ['Approver', 'approverName'],
    ['Plan Type', 'planType'],
    ['Exception Type', 'exceptionType'],
    ['Origination', 'origination'],
    ['TimeStamp', 'createTime'],
  ]);
  public static PRELOAD_SUCCESS_MSG = 'The preload strategies refreshed ';
  public static PRELOAD_FAIL_MSG = 'The preload strategies request failed.';
  public static COMPANY_HQ_OVERRIDES_TABLE_HEADERS = new Map([
    ['Company Code', 'companyCode'],
    ['Company Name', 'companyName'],
    ['Term Date', 'termDate'],
    ['OE Quarter', 'oeQuarter'],
    ['Plan Year', 'planYearStart'],
    ['Company HQ', 'state'],
    ['Zip', 'zip'],
    ['Override HQ', 'overrideHqState'],
    ['Override Zip', 'overrideHqZip'],
  ]);
    public static LIFE_DISABILITY_BAND_TABLE_HEADERS = new Map([
    ['Company ID', 'companyCode'],
    ['Company Name', 'companyName'],
    ['Start Date', 'startDate'],
    ['End Date', 'endDate'],
    ['Override Life Band', 'overrideLifeBand'],
    ['Override Disability Band', 'overrideDisabilityBand'],
    ['Approver', 'approverName'],
    ['TimeStamp', 'createTime'],
  ]);

  public static TYPE_ERROR = 'error';
  public static TYPE_CACEL = 'Cacel';
  public static TYPE_INFO = 'info';
  public static TYPE_SUCCESS = 'success';
  public static TYPE_WARNING = 'warning';
  public static TIMESTAMP_COLUMN = 'TimeStamp';
  public static MINFUND_EXCEPTIONS_TITLE = 'Minimum Funding Exceptions';
  public static PLAN_DESELECTION_TITLE = 'Plan Deselection Exception';
  public static MIN_DATE_DESELECTION_EXCEPTION = new Date('04/01/2023');
  public static HQ_OVERRIDE_EXCEPTIONS_TITLE = 'Headquarter Overrides';
  public static PLANTYPE_EXCEPTIONS_TITLE = 'Plan Type Exceptions';
  public static LIFE_DISABILITY_BAND_EXCEPTIONS_TITLE = 'Life & Disability Band Exceptions';
  public static HEADER_COLUMN = ['type', 'value', 'status', 'preloadDate', 'userId'];
  public static HEADER_VALUES = ['Preload Type', 'Value', 'Status', 'Preload Date', 'User ID'];
  public static OFFERED = 'Offered';
  public static NOT_OFFERED = 'Not Offered';
  public static UNKNOWN_PLANTYPE = 'Plan Type Unknown ';
  public static LOCALHOST = 'localhost';
  public static EMPLID = '00001940534';
  public static MOCK_COMPANY_CODE = '001';
  public static PRELOAD_PAGE_TITLE = 'Preload Strategies';
  public static PRELOAD_STATUS = ['New', 'Inprogress', 'Processed', 'Failed'];
  public static PRELOAD_OPSTIONS: PreloadOption[] = [
    { attributeValue: 1, name: 'By Quarter' },
    { attributeValue: 2, name: 'By Company' },
  ];
  public static DROP_DOWN_KEY_VALUE = { key: 'name', value: 'valueAttr' };
  public static PLAN_ATTRIBUTES_COMPARISION_TITLE = 'Compare Plan Attributes';
  public static PLAN_ATTRIBUTES_ERROR_MSG = `Our system encountered an error, please try again. If the problem persists, <a href="https://trinet.hrpassport.com/#/app/main/contact" target="_blank">contact TriNet Support</a>.`;
  public static DATE_FORMAT = 'MM/dd/yyyy';
  public static STATE_NAME = [
    'AK',
    'AL',
    'AR',
    'AZ',
    'CA',
    'CO',
    'CT',
    'DC',
    'DE',
    'FL',
    'GA',
    'HI',
    'IA',
    'ID',
    'IL',
    'IN',
    'KS',
    'KY',
    'LA',
    'MA',
    'MD',
    'ME',
    'MI',
    'MN',
    'MO',
    'MS',
    'MT',
    'NC',
    'ND',
    'NE',
    'NH',
    'NJ',
    'NM',
    'NV',
    'NY',
    'OH',
    'OK',
    'OR',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VA',
    'VT',
    'WA',
    'WI',
    'WV',
    'WY',
  ];

  public static LIFE_DISABILITY_BANDS = [
    '1',
    '2',
    '3',
    '4'
  ];
}
