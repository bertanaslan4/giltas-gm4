export class Customer {
  ModelType: number;
  CustomerName: string;
  AccountClosingDate: Date;
  AccountOpeningDate: Date;
  AgreementDate: Date;
  CreditLimit: number;
  CurrAccCode: any;
  CurrAccTypeCode: any;
  CurrAccDefault: CurrAccDefault;
  CurrAccPersonalInfo: CurrAccPersonalInfo;
  CurrencyCode: string;
  CustomerDiscountGrCode: string;
  CustomerPaymentPlanGrCode: string;
  CustomerVerificationPassword: CustomerVerificationPassword;
  DataLanguageCode: string;
  DueDateFormulaCode: string;
  FirstName: string;
  Suspended: number;
  DebtStatusTypeCode: number;
  BadDebtReasonCode: string;
  IdentityNum: string;
  IsBlocked: boolean;
  IsIndividualAcc: boolean;
  IsSendAdvertMail: boolean;
  IsSendAdvertSMS: boolean;
  IsSubjectToEInvoice: boolean;
  IsUserConfirmationRequired: boolean;
  IsVIP: boolean;
  LastName: string;
  OfficeCode: string;
  Patronym: string;
  PaymentTerm: number;
  PostalAddresses: PostalAddress[];
  PromotionGroupCode: string;
  RetailSalePriceGroupCode: string;
  TaxNumber: string;
  TaxOfficeCode: string;
  TitleCode: string;
  UseBankAccOnStore: boolean;
  WholesalePriceGroupCode: string;
  Email: string;
  Mobile: string;
  Phone: string;
  Address: string;
}

export class CurrAccDefault {
  CurrAccCode: string;
  BillingAddressID: string;
  BusinessMobileID: string;
  CommunicationID: string;
  ContactID: string;
  EArchieveEMailCommunicationID: string;
  EArchieveMobileCommunicationID: string;
  HomePhoneID: string;
  OfficePhoneID: string;
  PersonalMobileID: string;
  PostalAddressID: string;
  ShippingAddressID: string;
  SubCurrAccID: string;
}

export class CurrAccPersonalInfo {
  BirthPlace: string;
  CurrAccCode: string;
  CurrAccTypeCode: string;
  DrivingLicenceType: string;
  DrivingLicenceTypeNum: string;
  FatherName: string;
  GenderCode: string;
  IdentityCardNum: string;
  MaidenName: string;
  MonthlyIncome: string;
  MotherName: string;
  PersonalInfoID: string;
  RegisteredCityCode: string;
  RegisteredDistrictCode: string;
  RegisteredFamilyNum: string;
  RegisteredFileNum: string;
  RegisteredNum: string;
  RegisteredRecordNum: string;
  RegisteredTown: string;
  SocialInsuranceNumber: string;
  BirthDate: any;
}

export class CustomerVerificationPassword {
  CompanyCode: number;
  OfficeCode: string;
  Password: string;
  PasswordExpiryPeriod: number;
  PasswordLastUpdatedDate: Date;
  PasswordNeverExpires: boolean;
  PosTerminalID: number;
  StoreCode: string;
}

export class PostalAddress {
  Address: string;
  AddressID: string;
  AddressTypeCode: string;
  BuildingName: string;
  BuildingNum: string;
  CityCode: string;
  ContactID: string;
  CountryCode: string;
  DistrictCode: string;
  DoorNum: number;
  DrivingDirections: string;
  FloorNum: number;
  IsBlocked: boolean;
  PostalAddressID: string;
  QuarterCode: number;
  QuarterName: string;
  SiteName: string;
  StateCode: string;
  StreetCode: number;
  StreetName: string;
  SubCurrAccID: string;
  TaxNumber: string;
  TaxOfficeCode: string;
  ZipCode: string;
  Street: string;
}