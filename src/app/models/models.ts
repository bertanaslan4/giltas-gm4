export class Settings {
  Header: string;
  Integrator: Integrator;
  Token: string;
  G3Settings: G3Settings;
  V3Settings: V3Settings;
  G3License: G3License;
  FetchDate: number;
}

export class Data {
}
export class Exception {
  ExceptionMessage: string;
  StackTrace: string;
  Source: string;
  Data: Data;
  InnerException?: any;
}

export class Integrator {
  Url: string;
  DatabaseName: string;
  UserGroupCode: string;
  UserName: string;
  Password: string;
}

export class G3Settings {
  ImageUrl: string;
  OrderCount: number;
  Currency: string;

  // New for ionic 4 & App package.
  UseInventoryInProductDetail: boolean = true;  // true : eke, false : ozsanal
  SendReceiptViaMail: boolean = true; // eke
  SendEmailTo: string; // eke
  EnableMultipleView: Boolean; // eke
  ShowTotalInReports: boolean; // ozsanal
  UseCustomPrice: boolean; // eke
  ShowPaymentPlans: boolean; // ozsanal
  ShowTaxPlans: boolean; // eke

  ForCreditCardPlan: boolean; // eke 0, ozsanal 1 (takistli haric)
  UseColorSizeMatrix: boolean;
  SetIsCreditSaleAndIsCompleted : boolean;
  AddOrderDiscount: boolean;





  // is completed
  // is credit sale

}

export class G3License {
  Modules: string; 
  /**
   * 0   0    0   0   0   0
   * U   M    S   R   K   R
   * 
   * U : Ürün
   * M : Müşteri
   * S : Satış
   * R : Rapor
   * K : Kampanya
   * R : Raf
   *  */ 

  SalesTypes: string; 
  /**
   * 0    0    0    0   0   0
   * TO   P    TA   I   PSH PSS
   *  
   * TO : Toptan Satış = 0
   * P  : Perakende Satış = 1
   * TA : Taksitli Satış = 2
   * I  : Ihracat Satış = 3
   * PSH: Peşin Satış Hemen Teslim = 4
   * PSS: Peşin Satış Sonra Teslim = 5 
   *   Bayi Satış = 6
   *  */ 

}

export class V3Settings {
  SalespersonCode: string;
  SalespersonNameCode: string;
  SalespersonPassword: string;
  SalespersonName: string;  
  SalespersonEmail: string;  
  OfficeCode: string;
  StoreCode: string;
  WarehouseCode: string;
  IsExchange: boolean;
  POSTerminalID: string;
  PaymentCode: string;
  IsGuarantor: boolean;
  IsSuspended: boolean;
  IsProductPriceByGrCode: boolean;
  IsProductPhotos: boolean;
  CreditLimit: number;
  DiscountType: number;
  SalesType: number;
  PaymentTerm: number;
  PriceGroupCode: string;
  PriceGroupCodeWs: string;
  DiscountTypeCode: string;
  DiscountReasonCode: string;
  IsPercentage: boolean;  
}

export class Product {
  ItemCode: string;
  ItemDescription: string;
  Price: number;
  Qty1: any ;
  MaxQty: number = 0;
  UsedBarcode: string;
  PriceList: ProductPrice[];
  PaymentPlanCode: string;
  PaymentPlanProduct: ProductPaymentPlan[];
  LDisRate1: any;
  Content: any;  
  RatePrice: number = 0;
  ColorCode: string;
  ItemDim1Code: string;
  BarcodeType: number;
  seriNumber: any = "";
  UseSerialNumber: boolean;
  MesureCode: any = "";
  Barcode: any;
  MesureCodeDesc1:any="";
}

export class IntegratorProduct {
  UsedBarcode: string;
  ItemTypeCode: number;
  PriceVI: number;
  Price: number;
  ProductSerialNumber: string;
  Qty1: any ="";
  PaymentPlanCode: string;
  LDisRate1: any;
}

export class IntegratorLotProduct {
  ItemTypeCode: number;
  LotBarcode: string;
  Qty1: any ="";
}

export class ProductDetails {
  Inventory: number;
  ItemCode: string;
  ItemDescription: string;
  ItemTaxGrCode: any;
  ProductAtt01Desc: string;
  ProductAtt02Desc: string;
  ProductAtt03Desc: string;
  ProductAtt08Desc: string;
  ProductHierarchyLevel01: string;
  ProductHierarchyLevel02: string;
  ProductHierarchyLevel03: string;
  ProductTypeDescription: string;
  RetailSalePrice: number;
  SalePrice: number;
  MesureCode: string;
  MesureCodeDesc: string;
  UseSerialNumber: boolean;
}

export class ProductPrice {
  PaymentPlanCode: string;
  Price: number;
  PriceGroupCode: string;
  PriceGroupCodeWs:string;
}

export class ProductPaymentPlan {
  PaymentPlanCode: string;
  PaymentPlanDescription: string;
  PaymentPercentage: number;
  InstallmentCount: number;
}

export class PaymentPlan {
  PaymentPlanCode: string;
  PaymentPlanDescription: string;
  PaymentPercentage: number;
  InstallmentCount: number;
}

export class CustomerDebit {
  CurrAccCode: string;
  DovizAlacak: String;
  DovizBakiye: String;
  DovizBorc: String;
  TLAlacak: String;
  TLBakiye: String;
  TLBorc: String;
}

export class Color {
  ColorCode: string;
  ColorHex: string;
  ColorDescription: string;
}

