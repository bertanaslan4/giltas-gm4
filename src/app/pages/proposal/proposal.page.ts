//2003
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActionSheetController, AlertController, NavController, ModalController } from '@ionic/angular';
import { EnvService } from 'src/app/services/env.service';
import { ServerService } from 'src/app/services/server.service';
import { NavigationExtras, Router, ActivatedRoute, } from '@angular/router';
import { IntegratorLotProduct, IntegratorProduct, PaymentPlan, Product, ProductDetails } from "src/app/models/models";
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { Order } from "src/app/models/order";
import { Exception } from "src/app/models/models"

import { Customer } from "src/app/models/customer";
import { ModalProposalReceiptPage } from '../modal-proposal-receipt/modal-proposal-receipt.page';
import { ProposalTypePage } from './../proposal-type/proposal-type.page';
import { isArray } from 'util';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.page.html',
  styleUrls: ['./proposal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalPage implements OnInit {

  planData = {
    "ProcName": "G4_GetPaymentPlan",
    "Parameters":
      [
        { "Name": "Language", "Value": "TR" }, { "Name": "ForCreditCardPlan", "Value": "" }
      ]
  };
  barcodeData = {
    "ProcName": "G4_GetProductPriceByBarcode",
    "Parameters":
      [
        { "Name": "Barcode", "Value": "" }, { "Name": "PriceGroupCode", "Value": "" }
      ]
  };
  storeData = {
    "ProcName": "",
    "Parameters":
      [
        { "Name": "ItemCode", "Value": "" }, { "Name": "WarehouseCode", "Value": "" }
      ]
  };
  getOrderData = {
    "ProcName": "G4_GetOrderDetails",
    "Parameters":
      [
        { "Name": "OrderNumber", "Value": "" }
      ]
  };
  addData = {
    "ProcName": "G4_AddUserWarning",
    "Parameters":
      [
        { "Name": "CurrAccCode", "Value": "" }, { "Name": "CurrAccPaid", "Value": "" }
      ]
  };
  updateOrderData = {
    "ProcName": "G4_SetOrderIsCompleted",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }
      ]
  };
  updateInvoiceData = {
    "ProcName": "G4_SetInvoiceIsCompleted",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }
      ]
  };
  updateProposalData = {
    "ProcName": "G4_SetProposalData",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }, { "Name": "Code", "Value": "" }
      ]
  };
  updateOrderIsCompleted = {
    "ProcName": "G4_SetIsCreditTableConfirmed",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }
      ]
  };
  updatesetIsCreditSaleAndIsCompleted = {
    "ProcName": "G4_SetIsCreditSaleAndIsCompleted",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }
      ]
  };
  deleteTrOrderPaymentPlan = {
    "ProcName": "G4_DeleteTrOrderPaymentPlan",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }
      ]
  };
  setHeaderID = {
    "ProcName": "",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }
      ]
  };
  updateSalesPerson = {
    "ProcName": "",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }, { "Name": "Salespersoncode", "Value": "" }
      ]
  };
  paymentPlanGrCode = {
    "ProcName": "G4_GetPaymentPlanByItemCode",
    "Parameters":
      [
        { "Name": "Language", "Value": "" }, { "Name": "PriceGroupCode", "Value": "" },
        { "Name": "ItemCode", "Value": "" }
      ]
  };
  addProposalReport = {
    "ProcName": "G4_AddProposalReport",
    "Parameters":
      [
        { "Name": "HeaderID", "Value": "" }, { "Name": "LineID", "Value": "" },
        { "Name": "StoreCode", "Value": "" }, { "Name": "ProcessCode", "Value": "" },
        { "Name": "ApplicationCode", "Value": "" }, { "Name": "CurrAccCode", "Value": "" },
        { "Name": "Number", "Value": "" }, { "Name": "Date", "Value": "" },
        { "Name": "Time", "Value": "" }, { "Name": "ItemCode", "Value": "" },
        { "Name": "ColorCode", "Value": "" }, { "Name": "ItemDim1Code", "Value": "" },
        { "Name": "Qty1", "Value": {} }, { "Name": "SalespersonCode", "Value": "" },
        { "Name": "Price", "Value": "" }, { "Name": "CreatedUserName", "Value": "" },
        { "Name": "@IsCompleted", "Value": false }
      ]
  };
  getAvailableInventoryV3 = {
    "ProcName": "G4_GetAvailableInventoryNew",
    "Parameters":
      [
        { "Name": "ItemCode", "Value": "" }, { "Name": "ColorCode", "Value": "" }
      ]
  };
  AddSerialInvoice = {
    "ProcName": "G4_AddSerialInvoice",
    "Parameters":
      [
        { "Name": "InvoiceLineID", "Value": "" }, { "Name": "SerialNumber", "Value": "" }
      ]
  };
  AddItemSerial = {
    "ProcName": "G4_AddItemSerial",
    "Parameters":
      [
        { "Name": "SerialNumber", "Value": "" }
      ]
  };
  customerPointData = {
    "ProcName": "G4_GetCustomerPoint",
    "Parameters":
      [
        { "Name": "CurrAccTypeCode", "Value": "" }, { "Name": "CurrAccCode", "Value": "" },
        { "Name": "OperationDate", "Value": "" }, { "Name": "OperationTime", "Value": "" },
        { "Name": "ProcessCode", "Value": "" }, { "Name": "OfficeCode", "Value": "" },
        { "Name": "StoreCode", "Value": "" }, { "Name": "LangCode", "Value": "TR" }
      ]
  };
  orderData = {
    "ModelType":6,
    "CustomerCode": "",
    "OfficeCode": "",
    "StoreCode": "",
    "PosTerminalID": "0", // TODO add it to settings : OK
    "IsCompleted": false,
    "IsSuspended": false,
    "IsCreditSale": false,
    "Lines": [],
    "SumLines": [],
    "PaymentTerm": 0,
    "TaxTypeCode": 0,
    "TDisRate1": 0,
    "StoreWareHouseCode": "",
    "WareHouseCode": ""
  };
  invoiceData = {
    "ModelType": 8,
    "CustomerCode": "",
    "PosTerminalID": "",
    "InvoiceDate": "",
    "Description": "GM",
    "ShipmentMethodCode": 2,
    "CompanyCode": "2",
    "OfficeCode": "",
    "WareHouseCode": "",
    "StoreCode": "",
    "Lines": [],
    "SuppressItemDiscount": false,
    "IsCompleted": false,
    "IsSuspended": true,
    "IsSalesViaInternet": false,
    "ApplyCampaign": true,
  };
  paymentsData = [{
    "PaymentType": "1",  //TODO Move it to setting
    "Code": "",  //TODO Move it to setting  : OK
    "CreditCardTypeCode": "",
    "InstallmentCount": "",
    "CurrencyCode": "TRY",
    "DownPayment": "0",
    "Amount": "0"
  }];
  discountData = [{
    "DiscountTypeCode": "",
    "Value": 0,
    "DiscountReasonCode": "",
    "IsPercentage": false
  }];
  tcno:any;
  pageRoute: any;
  salesTypeLicense: any;
  orderTypeName: string = "Satış Tipi";
  plans: PaymentPlan[] = new Array();
  currentPlanCode: any = "";
  PriceGroupCode: any;
  CustomerNameRececipt: any = 'Müşteri Seç';
  CustomerCodeRececipt: any;
  customer: Customer;
  infoText: any = "";
  customerMoneyPoint: string = '';
  paymentPlanGrCodeList: any[] = new Array();
  currentPlanCodeArrayCount: number = 0;
  currentPlanCodeArray: any = [];
  currentUsedBarcodeArray: any = [];
  installementCount: number = 1;
  mesureCodeDesc: any;
  // açıklama
  productDetails: ProductDetails;
  place: number = 0;
  CustomerRefNRececipt: any;
  CustomerDipRececipt: any;
  CustomerTaxTRececipt: any[] = [];
  CustomerProdRececipt: any = [];
  CustomerInfoRececipt: string;
  CustomerPaidRececipt: number = 0;
  productColorSizeMatrix: any[] = [];
  sizes: any;
  taxPlans: any[] = new Array();
  monthly: number = 0;
  total: number = 0;
  realQty: number = 0;
  data: boolean;
  paid: number = 0;
  remain: number = 0;
  imageText: string;
  base64Image: string;
  checkbutton: boolean = false;
  firstcurrent: boolean = true;

  mDesc: any = "";

  //selected customer
  numberCustomer: number = 0;
  numberProduct: number = 0;
  exvalue: any = {};

  currentSalesType = this.serverService.Settings.V3Settings.SalesType;

  selectSalesType: any[] = [
    { TypeCode: 0, TypeName: "Toptan Satış" },
    { TypeCode: 1, TypeName: "Perakende Satış" },
    { TypeCode: 2, TypeName: "Taksitli Satış" },
    { TypeCode: 3, TypeName: "İhracat Satış" },
    { TypeCode: 4, TypeName: "Peşin Satış(Hemen Teslim)" },
    { TypeCode: 5, TypeName: "Peşin Satış(Sonra Teslim)" }
  ];

  constructor(
    public envService: EnvService, public serverService: ServerService,
    private navCtrl: NavController, public actionSheetController: ActionSheetController,
    public router: Router, private activatedRoute: ActivatedRoute,
    public translateService: TranslateService, public alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner, public modalCtrl: ModalController,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.pageRoute = this.router.routerState.snapshot.url
    this.salesTypeLicense = this.serverService.Settings.G3License.SalesTypes;
    console.log(this.serverService.Settings.V3Settings.SalespersonPassword);
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    console.log("Proposal SalesType", this.serverService.Settings.V3Settings.SalesType);
    this.getProposalType(this.serverService.Settings.V3Settings.SalesType);
    this.setIsSuspended();
  }

  logScrolling(e) {
    console.log(e)
  }

  ionViewWillEnter() {//For Select Customer AND Select Product
    this.router.routerState.root.queryParams.subscribe(value => { // her işlemde extra 1 kere daha giriyor, başka yöntem bulmak gerekli

      if (value.CurrAccCode && value.CurrAccCode != this.exvalue && this.numberCustomer == 0) { // customer
        this.numberCustomer++;
        this.exvalue = value.CurrAccCode;
        console.log(value);
        this.tcno=value.IdentityNum;
        this.selectedCustomer(value);
      }

      if (value.result && value.result == 'true' && this.numberProduct == 0) { // product
        this.numberProduct++;
        console.log(value)
        if (this.serverService.Settings.V3Settings.SalesType != 2) {
          this.onPlanChanged(event);
        } else {
          this.onPlanChangedByProduct(Product, event);
        }
      }
    })

  }

  onPlanChanged(event) {
    //TODO Remove it
    /*if (this.check5database == 1) {
      if (this.serverService.Items.length > 0 && this.firstcurrent) {
        this.firstcurrent = false;
        this.currentPlanCode = this.serverService.Items[0].PriceList[0].PaymentPlanCode;
      }
    }*/
    console.log('Current Plan Code: ', this.currentPlanCode);
    for (let p of this.serverService.Items) {
      p.Price = this.getCurrentPrice(p.PriceList);
    }
    this.CustomerProdRececipt = this.serverService.Items;
    console.log("customerprodreceipt", this.CustomerProdRececipt);
    this.calculate();
  }

  getProposalType(saleType) {

    if (this.serverService.Settings.G3Settings.ForCreditCardPlan) {
      if (saleType == 0) this.planData.Parameters[1].Value = '1', this.orderTypeName = "Toptan Satış";
      else if (saleType == 1) this.planData.Parameters[1].Value = '1', this.orderTypeName = "Perakende Satış";
      else if (saleType == 2) this.planData.Parameters[1].Value = '0', this.orderTypeName = "Taksitli Satış";
      else if (saleType == 3) this.planData.Parameters[1].Value = '1', this.orderTypeName = "İhracat Satış";
      else if (saleType == 4) this.planData.Parameters[1].Value = '1', this.orderTypeName = "Peşin Satış (HT)";
      else if (saleType == 5) this.planData.Parameters[1].Value = '1', this.orderTypeName = "Peşin Satış (ST)";
    } else {
      if (saleType == 0) this.planData.Parameters[1].Value = '0', this.orderTypeName = "Toptan Satış";
      else if (saleType == 1) this.planData.Parameters[1].Value = '0', this.orderTypeName = "Perakende Satış";
      else if (saleType == 2) this.planData.Parameters[1].Value = '0', this.orderTypeName = "Taksitli Satış";
      else if (saleType == 3) this.planData.Parameters[1].Value = '0', this.orderTypeName = "İhracat Satış";
      else if (saleType == 4) this.planData.Parameters[1].Value = '0', this.orderTypeName = "Peşin Satış (HT)";
      else if (saleType == 5) this.planData.Parameters[1].Value = '0', this.orderTypeName = "Peşin Satış (ST)";
    }

    this.serverService.getPaymentPlan(this.planData).then(res => {
      console.log('plans1', res);
      this.plans = res;
    }).catch(this.envService.handleError);

    //this.clearCustomer();
    //this.clearItems();
  }

  getPriceGroup(item: string) {
    if (this.serverService.Settings.G3Settings.Currency != '') {
      this.PriceGroupCode = '';
      return this.serverService.Settings.G3Settings.Currency;
    }
    var tempPriceGroupCode: string;
    if (item == null) {
      tempPriceGroupCode = '€'
      this.PriceGroupCode = 'EUR'
      return tempPriceGroupCode;
    } else {
      if (item.charAt(0) == "€") {
        tempPriceGroupCode = '€'
        this.PriceGroupCode = 'EUR'
        return tempPriceGroupCode;
      } else if (item.charAt(0) == "$") {
        tempPriceGroupCode = '$'
        this.PriceGroupCode = 'USD'
        return tempPriceGroupCode;
      } else {
        tempPriceGroupCode = '₺'
        this.PriceGroupCode = ''
        return tempPriceGroupCode;
      }
    }
  }

  getCustomerPoint(customer) {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(date + ' ' + time)
    this.customerPointData.Parameters[0].Value = customer.CurrAccTypeCode;
    this.customerPointData.Parameters[1].Value = customer.CurrAccCode;
    this.customerPointData.Parameters[2].Value = date + ' ' + time;
    this.customerPointData.Parameters[3].Value = time;
    this.customerPointData.Parameters[4].Value = 'R'
    this.customerPointData.Parameters[5].Value = this.serverService.Settings.V3Settings.OfficeCode;
    this.customerPointData.Parameters[6].Value = this.serverService.Settings.V3Settings.StoreCode;
    this.serverService.getAny(this.customerPointData)
      .then(res => {
        console.log('remaining point', res);
        if (isArray(res) && res.length > 0) {
          let alertSubTitle = 'Birikmiş Puan:' + ' ' + res[0].RemainingPoint + ' ' + '₺';
          this.customerMoneyPoint = '(' + res[0].RemainingPoint + ' ' + '₺' + ')';
          this.envService.presentAlert('Bilgi', alertSubTitle);
        }
      })
  }

  removeProduct(index: number) {
    this.serverService.Items.splice(index, 1);
    this.calculate();
  }

  editProduct(index: number, data: any) {
    console.log(data);

    if (this.serverService.Settings.V3Settings.DiscountType == 0) {
      this.envService.presentToast('Ayarlarinizi kontrol ediniz, bu islem yapamazsiniz!')
      return;
    }

    this.serverService.Items[index].Qty1 = this.serverService.Items[index].Qty1;
    // JS
    //if (this.serverService.Settings.V3Settings.DiscountType == 0) {
    //  this.serverService.Items[index].Price = data.price;
    //} else {
    if (data.price > 0) {
      //product.LDisRate1*product.Price/100 
      //product.Price - product.LDisRate1*product.Price/100
      let discount: number = data.price / this.serverService.Items[index].Price * 100;
      console.log('discount : ' + discount);
      this.serverService.Items[index].LDisRate1 = discount;
      this.serverService.Items[index].RatePrice = data.price;
    } else {
      this.serverService.Items[index].LDisRate1 = data.pprice;
      this.serverService.Items[index].RatePrice = data.pprice * this.serverService.Items[index].Price / 100;
      console.log(this.serverService.Items);
    }
    //}
    this.calculate();
  }

  editProductNew(index: number, data: any) {
    if (this.serverService.Settings.V3Settings.DiscountType == 1) {
      this.envService.presentToast('Ayarlarinizi kontrol ediniz, bu islem yapamazsiniz!')
      return;
    }
    this.serverService.Items[index].Price = data.price;
    this.calculate();
  }


  //sipariş seç modalı
  async selectOrder() {

    let modal;
    modal = await this.modalCtrl.create({
      component: ProposalTypePage,
      componentProps: {
        nextPage: 'proposal'
      }
    });
    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.envService.presentToast('Bu aşamadan sonra sipariş oluşturursanız, yeni bir sipariş oluşturur')
        this.getOrderData.Parameters[0].Value = data;
        this.serverService.getAny(this.getOrderData)
          .then(res => {
            console.log(res);
            if (res) {
              this.serverService.Items = [];
              for (let item of res) {
                let product = new Product();
                product = item;
                this.pushProduct(product);
                this.orderData.TDisRate1 = item.TDisRate1;
              }
              this.setCurrentPriceAll();
              this.calculate();
            }
          })
          .catch(this.envService.handleError);
      }
    });
    modal.present();
  }

  pushProduct(product: Product) {
    for (let item of this.serverService.Items) {
      if (item.ItemCode == product.ItemCode && item.UsedBarcode == product.UsedBarcode) {
        item.Qty1++;
        return
      }
    }

    console.log(product.ItemCode);
    this.storeData.ProcName = "G4_GetProductDetails";
    this.storeData.Parameters[0].Value = product.ItemCode;
    this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
    this.serverService.getAny(this.storeData).then(res => {
      console.log('G4_GetProductDetails');
      console.log(res);
      this.productDetails = res[0];
      product.MesureCodeDesc1 = "xx";
      //product.MesureCodeDesc1=res[0].MesureCodeDesc;
      this.mDesc = res[0].MesureCodeDesc;
      console.log("mDesc1", res[0].MesureCodeDesc);

      console.log("mesure description ", this.mesureCodeDesc);
      product.UseSerialNumber = res[0].UseSerialNumber;
      if (this.serverService.Settings.G3Settings.UseColorSizeMatrix) {
        this.storeData.ProcName = "G4_GetProductColorSizeMatrix";
        this.storeData.Parameters[0].Value = product.ItemCode;
        this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
        this.serverService.getAny(this.storeData).then(res => {
          //console.log(res);     
          this.mDesc = "mDesc1";
          console.log("mDesc1", this.mDesc);
          this.productColorSizeMatrix = res;
          this.sizes = this.productColorSizeMatrix.find(x => x['R/B'] == product.ColorCode);
          product.Content = this.productDetails.ProductAtt08Desc ? this.productDetails.ProductAtt08Desc : '';
          product.MaxQty = this.sizes[product.ItemDim1Code];
          product.MesureCodeDesc1 = res[0].MesureCodeDesc;
          product.MesureCodeDesc1 = "xx1";
          this.mDesc = "mdesc2";
          console.log("mDesc2", this.mDesc);
          console.log("mesure description", this.mesureCodeDesc);
          console.log(this.sizes);
        })
        product.MesureCode = this.productDetails.MesureCode;
      } else {
        product.MesureCode = res[0].MesureCode;
      }
    }).catch(error => this.envService.handleError(error));
    this.serverService.Items.push(product);
  }

  setDiscount(data: any) {
    this.orderData.TDisRate1 = data.discount;
    console.log(this.discountData);
  }

  getCurrentPrice(list) {

    for (let pp of list) {
      if (pp.PaymentPlanCode == this.currentPlanCode)
        return pp.Price;
      console.log(pp.price)
    }

  }

  setCurrentPriceAll() {
    if (this.serverService.Settings.V3Settings.IsProductPriceByGrCode == false || this.serverService.Settings.V3Settings.IsProductPriceByGrCode == true && this.serverService.Settings.V3Settings.SalesType != 2) {
      for (let product of this.serverService.Items) {
        if (this.customer) {
          for (let pp of product.PriceList) {
            if (this.customer.WholesalePriceGroupCode == pp.PriceGroupCode) {
              product.Price = pp.Price;
              console.log(product.Price)
              return;
            }
          }
        }
        for (let pp of product.PriceList) {
          if (pp.PaymentPlanCode == this.currentPlanCode) {
            product.Price = pp.Price;
            console.log(product.Price)
            return;
          }
        }
      }
    }
  }

  calculate() {
    this.calculateTotal();
    this.calculateInstallment();
    this.calculateRemain(this.paid);
  }

  calculateTotal() {
    this.total = 0;
    for (let p of this.serverService.Items) {
      this.total += (p.Price - p.LDisRate1 * p.Price / 100) * p.Qty1;
    }
    this.total = this.calculateFloatTotal(this.total);
    if (this.orderData.TDisRate1 > 0) {
      this.total = this.total - (this.total * this.orderData.TDisRate1 / 100);
    }
    if (this.total == undefined || this.total == Number.NaN) this.total = 0;
  }

  calculateFloatTotal(test: number) {
    var tempstring = test.toString();
    var indexDot = tempstring.indexOf(".");
    if (indexDot != -1) {
      return test = parseFloat(tempstring.substring(0, indexDot + 2));
    } else {
      return test;
    }
  }

  calculateInstallment() {
    for (let plan of this.plans) {
      if (plan.PaymentPlanCode == this.currentPlanCode) {
        this.installementCount = plan.InstallmentCount;
        break;
      }
    }
    var tempMonthly = ((this.total - this.paid) / this.installementCount).toString();
    var indexDot = tempMonthly.indexOf(".");
    if (indexDot == -1) {
      this.monthly = (this.total - this.paid) / this.installementCount;
    } else {
      this.monthly = parseFloat(tempMonthly.substring(0, indexDot + 2));
    }

  }

  calculateRemain(paid: number) {
    if (paid == 0) this.paid = null;
    if (this.paid > this.total) {
      this.paid = this.total
    }
    this.remain = Number.parseFloat((this.total - this.paid).toFixed(1));
    this.calculateInstallment();
  }

  getTotal() {
    this.calculate();
    return this.total;
  }

  makeOrder() {
    //askıda sipariş
    console.log("Make Order", this.serverService.Settings.V3Settings.SalesType);
    if (this.serverService.Settings.V3Settings.IsSuspended) {
      this.orderData.IsSuspended = true;
    } else {
      this.orderData.IsSuspended = false
    }
    this.CustomerProdRececipt = this.serverService.Items;
    this.orderData.ModelType = this.getModelType();
    console.log('this.orderData.ModelType : ', this.orderData.ModelType);
    if (this.orderData.ModelType == 5 || this.orderData.ModelType == 14) {

      delete this.orderData.StoreWareHouseCode;// 
      delete this.orderData.StoreCode;//

      this.orderData.IsCreditSale = false;
      this.orderData.OfficeCode = this.serverService.Settings.V3Settings.OfficeCode;//
      //this.orderData.StoreCode = '';      
      this.orderData.PaymentTerm = this.serverService.Settings.V3Settings.PaymentTerm;
      this.orderData.WareHouseCode = this.serverService.Settings.V3Settings.WarehouseCode;
      console.log('1');
    } else if (this.orderData.ModelType == 6) {// Peşin Sonradan Teslim

      delete this.orderData.WareHouseCode;

      this.orderData.IsCreditSale = false;
      //this.orderData.SalespersonCode = this.serverService.Settings.SalespersonCode;
      this.orderData.OfficeCode = this.serverService.Settings.V3Settings.OfficeCode;
      this.orderData.StoreCode = this.serverService.Settings.V3Settings.StoreCode;
      this.orderData.StoreWareHouseCode = this.serverService.Settings.V3Settings.WarehouseCode;
      this.orderData.PosTerminalID = this.serverService.Settings.V3Settings.POSTerminalID;

    } else if (this.orderData.ModelType == 8) {//Peşin Hemen Teslim (FATURA)

      //this.orderData.SalespersonCode = this.serverService.Settings.SalespersonCode;
      this.invoiceData.OfficeCode = this.serverService.Settings.V3Settings.OfficeCode;
      this.invoiceData.StoreCode = this.serverService.Settings.V3Settings.StoreCode;
      this.invoiceData.WareHouseCode = this.serverService.Settings.V3Settings.WarehouseCode;
      this.invoiceData.PosTerminalID = this.serverService.Settings.V3Settings.POSTerminalID;

      if (this.serverService.Settings.Integrator.DatabaseName == "Demo_v3") this.invoiceData.CompanyCode = "1"

    } else if (this.orderData.ModelType == 16) { // taksitli

      //şüpheli müşteri
      if (this.customer.DebtStatusTypeCode == 0) {
        // Sipariş Atabilir
      } else {
        if (this.customer.DebtStatusTypeCode == 1 || this.customer.DebtStatusTypeCode == 2 || this.customer.DebtStatusTypeCode == 3 || this.customer.DebtStatusTypeCode == 4) {
          if (this.customer.BadDebtReasonCode == '01' || this.customer.BadDebtReasonCode == '04' || this.customer.BadDebtReasonCode == '06') {
            console.log(this.customer.DebtStatusTypeCode);
            console.log(this.customer.BadDebtReasonCode);
            if (this.serverService.Settings.V3Settings.SalesType == 2) { // taksitli
              this.envService.presentAlert('Uyarı', 'Müşteri Şüpheli Durumda,  Sadece Peşin Satış Yapılabilir.');
              return;
            } else {
              this.envService.presentToast('Müşteri Şüpheli Durumda,  Sadece Peşin Satış Yapılabilir.');
            }
          }
        }
      }

      delete this.orderData.WareHouseCode;

      this.orderData.IsCreditSale = true;
      this.orderData.OfficeCode = this.serverService.Settings.V3Settings.OfficeCode;
      this.orderData.StoreCode = this.serverService.Settings.V3Settings.StoreCode;
      this.orderData.StoreWareHouseCode = this.serverService.Settings.V3Settings.WarehouseCode;
      this.orderData.PosTerminalID = this.serverService.Settings.V3Settings.POSTerminalID;
      this.paymentsData[0].InstallmentCount = this.installementCount.toString();

    }
    if (this.orderData.ModelType == 8) {
      // tarih ayarı
      let myday: string = "";
      let mymonth: string = "";
      let myyear: string = "";
      let numberMonth: number = 0;
      let fullDate: string = "";
      myyear = new Date().getFullYear().toString();
      myday = new Date().getDate().toString();
      numberMonth = new Date().getMonth();
      numberMonth++;
      if (numberMonth < 10) {
        mymonth = "0" + numberMonth.toString();
      } else {
        mymonth = numberMonth.toString();
      }
      fullDate = myyear + '/' + mymonth + '/' + myday;

      this.invoiceData.InvoiceDate = fullDate;
      this.invoiceData.CustomerCode = this.customer.CurrAccCode;
      this.invoiceData.Lines = [];


      for (let p of this.serverService.Items) {
        console.log(p.seriNumber);
        console.log(p.BarcodeType);
        switch (p.BarcodeType) {
          // normal barcode
          case 1:
            let ip: IntegratorProduct = new IntegratorProduct();
            ip.UsedBarcode = p.UsedBarcode;
            ip.ItemTypeCode = 1;
            ip.ProductSerialNumber = p.seriNumber;
            console.log(ip.ProductSerialNumber);

            // İhracat ise VI = VD olmasın
            if (this.serverService.Settings.V3Settings.SalesType == 3) ip.Price = p.Price;
            else ip.PriceVI = p.Price;

            ip.Qty1 = p.Qty1;
            if (!(this.serverService.Settings.V3Settings.IsProductPriceByGrCode && this.serverService.Settings.V3Settings.SalesType == 2)) {
              ip.PaymentPlanCode = this.currentPlanCode;
            } else {
              for (var i = 0; i <= this.currentUsedBarcodeArray.length; i++) {
                if (this.currentUsedBarcodeArray[i] == ip.UsedBarcode) {
                  ip.PaymentPlanCode = this.currentPlanCodeArray[i];
                }
              }
            }

            ip.LDisRate1 = p.LDisRate1;
            this.invoiceData.Lines.push(ip);
            break;
          // lot barcode
          case 2:
            let ilp: IntegratorLotProduct = new IntegratorLotProduct();
            ilp.ItemTypeCode = 1;
            ilp.LotBarcode = p.UsedBarcode;
            ilp.Qty1 = p.Qty1;
            this.orderData.SumLines.push(ilp);
            break;
        }
      }
      if (this.discountData[0].Value > 0) {
        this.orderData['Discounts'] = this.discountData;
      }

      this.envService.presentLoading();

      this.serverService.makeOrder(this.invoiceData)
        .then(res => {

          //this.addItemSerial('SR001693582');
          //this.addSerialInvoice(res['Lines'][0]['LineID'],'SR001693582')

          console.log(JSON.stringify(res));
          console.log(res)

          this.CustomerRefNRececipt = res['InvoiceNumber'];

          console.log(this.CustomerRefNRececipt);

          this.envService.dismissLoading();
          let result: Order = Object.assign(new Order(), res);
          console.log(result.ModelType);
          if (result.ModelType == this.getModelType()) {
            if (this.serverService.Settings.V3Settings.SalesType == 4) {
              this.addCurrAccUserWarning();
              this.addProposalReportInvoice(result);
            }
            this.goToReceiptPage()
            this.setProposalData(result.HeaderID, result.OfficeCode);

            this.setSalesPersonData(result.HeaderID, this.serverService.Settings.V3Settings.SalespersonCode);

            this.setSalesPersonDataInvoice(result.HeaderID, this.serverService.Settings.V3Settings.SalespersonCode);
            this.reset();
          } else {
            let result: Exception = Object.assign(new Exception(), res);
            console.log("HATA");
            this.translateService.get('ALERT_ERROR_TITLE_TEXT').subscribe((value: string) => {
              this.envService.presentAlert(value, this.serverService.getReadableMessage(result.ExceptionMessage));
            });
          }
        }).catch(this.envService.handleError);
    }
    else {

      this.orderData.CustomerCode = this.customer.CurrAccCode;
      console.log("ModelType : rr", this.orderData.ModelType);

      console.log("Payment Plan Code MAke Order", this.currentPlanCode);

      this.orderData.Lines = [];
      this.orderData.SumLines = [];
      console.log("serverService.Items", this.serverService.Items)

      for (let p of this.serverService.Items) {
        console.log('BarcodeType : ', p.BarcodeType);
        switch (p.BarcodeType) {
          // normal barcode
          case 1:
            let ip: IntegratorProduct = new IntegratorProduct();
            ip.UsedBarcode = p.UsedBarcode;
            ip.ItemTypeCode = 1;

            //TODO JS çözemedim
            /*if (this.check5database == 1) {
              if (this.serverService.Settings.V3Settings.SalesType == 4) ip.Price = p.Price;
              else ip.Price = p.Price;
            } else {
              if (this.serverService.Settings.V3Settings.SalesType == 4) ip.Price = p.Price;
              else ip.PriceVI = p.Price;
            } */
            if (this.serverService.Settings.V3Settings.SalesType == 3) ip.Price = p.Price;
            else ip.PriceVI = p.Price;


            ip.Qty1 = p.Qty1;
            if ((this.serverService.Settings.V3Settings.IsProductPriceByGrCode && this.serverService.Settings.V3Settings.SalesType == 2)) {
              ip.PaymentPlanCode = this.currentPlanCode;
            } else {
              for (let i = 0; i <= this.currentUsedBarcodeArray.length; i++) {
                if (this.currentUsedBarcodeArray[i] == ip.UsedBarcode) {
                  ip.PaymentPlanCode = this.currentPlanCodeArray[i];
                }
              }
            }

            ip.LDisRate1 = p.LDisRate1;
            console.log(ip);
            this.orderData.Lines.push(ip);
            console.log(this.orderData.Lines)
            break;
          // lot barcode
          case 2:
            let ilp: IntegratorLotProduct = new IntegratorLotProduct();
            ilp.ItemTypeCode = 1;
            ilp.LotBarcode = p.UsedBarcode;
            ilp.Qty1 = p.Qty1;
            console.log(ilp)
            this.orderData.SumLines.push(ilp);
            break;
        }
      }

      if (this.discountData[0].Value > 0) {
        this.orderData['Discounts'] = this.discountData;
      }
      console.log(this.orderData)

      for (var n = 0; n < this.orderData.Lines.length; n++) {
        console.log(this.orderData.Lines[n].Qty1);
        this.addProposalReport.Parameters[12].Value = this.orderData.Lines[n].Qty1;
        console.log(this.orderData.Lines[n].Qty1);
      }

      console.log("Order daata", this.orderData);

      this.serverService.makeOrder(this.orderData)
        .then(res => {

          console.log(res); 

          console.log("OrderNumber : ",res['OrderNumber']);

          this.CustomerRefNRececipt = res.OrderNumber;
          this.CustomerTaxTRececipt = res.Lines;
          this.CustomerDipRececipt = res.TDisRate1 ? res.TDisRate1 : 0;
          console.log("CustomerTaxTRececipt", this.CustomerTaxTRececipt);
          console.log("CustomerRefTRececipt", this.CustomerRefNRececipt);
          console.log("CustomerDipTRececipt", this.CustomerDipRececipt);

          this.envService.dismissLoading();
          let result: Order = Object.assign(new Order(), res);
          if (result.ModelType == this.getModelType()) {
            if (this.serverService.Settings.V3Settings.SalesType == 2 || this.serverService.Settings.V3Settings.SalesType == 4 || this.serverService.Settings.V3Settings.SalesType == 5) {
              this.addCurrAccUserWarning();
              this.setOrderIsCompleted(result.HeaderID);
              this.addProposalReportOrder(result);
              this.setIsCreditableConfirmed(result.HeaderID);//taksitli satış istihbarat              
            }
            if (this.serverService.Settings.V3Settings.SalesType == 0 || this.serverService.Settings.V3Settings.SalesType == 3) {
              if (this.serverService.Settings.G3Settings.SetIsCreditSaleAndIsCompleted) {
                this.setIsCreditSaleAndIsCompleted(result.HeaderID);
              }
            }

            if (this.serverService.Settings.V3Settings.SalesType != 2) {
              this.goToReceiptPage();
            } else {
              this.translateService.get(['ALERT_INFORMATION_TITLE_TEXT', 'PROPOSAL_ALERT_PROPOSAL_CREATED_SUCCESSFULLY_MESSAGE_TEXT']).subscribe((value: string[]) => {
                this.envService.presentAlert(value['ALERT_INFORMATION_TITLE_TEXT'], value['PROPOSAL_ALERT_PROPOSAL_CREATED_SUCCESSFULLY_MESSAGE_TEXT']);
              });
            }
            this.setTrOrderPaymentPlan(result.HeaderID);
            this.setProposalData(result.HeaderID, result.OfficeCode);
            this.setSalesPersonData(result.HeaderID, this.serverService.Settings.V3Settings.SalespersonCode);
            this.setSalesPersonDataOthers(result.HeaderID, this.serverService.Settings.V3Settings.SalespersonCode);
            console.log(result.HeaderID + "\n" + this.serverService.Settings.V3Settings.SalespersonCode);
            this.reset();
          } else {
            let result: Exception = Object.assign(new Exception(), res);
            this.translateService.get('ALERT_ERROR_TITLE_TEXT').subscribe((value: string) => {
              this.envService.presentAlert(value, this.serverService.getReadableMessage(result.ExceptionMessage));
            });
          }
        }).catch(this.envService.handleError);
    }
  }

  async goToReceiptPage() {
    this.serverService.isOpenCamera = true;
    console.log("info: " + this.infoText);
    this.CustomerInfoRececipt = this.infoText;
    let modal;
    modal = await this.modalCtrl.create({
      component: ModalProposalReceiptPage,
      componentProps: {
        'identityNum':this.tcno,
        'customerName': this.CustomerNameRececipt,
        'customerCode': this.CustomerCodeRececipt,
        'refNo': this.CustomerRefNRececipt,
        'products': this.CustomerProdRececipt,
        'infoText': this.CustomerInfoRececipt,
        'paid': this.CustomerPaidRececipt,
        'priceGroupCode': this.PriceGroupCode ? this.PriceGroupCode : '₺',
        'tax': this.CustomerTaxTRececipt,
        'diptax': this.CustomerDipRececipt
      }
    });
    console.log("modal", modal);
    await modal.present();
    modal.onDidDismiss(data => {
      this.serverService.isOpenCamera = false;
    });
  }
  /*
  async selectProposalType() {

    console.log("selectProposalType currentSalesType start", this.currentSalesType);

    const actionSheet = await this.actionSheetController.create({
      header: 'Satış Tipi Seçiniz',
      buttons: [
        (this.salesTypeLicense.charAt(0) == 1) ?
          {
            text: 'Toptan Satış',
            icon: 'bookmark',
            handler: () => {
              this.getProposalType(0);
              this.serverService.Settings.V3Settings.SalesType = 0;
            }
          } : { cssClass: 'display-none' },
        (this.salesTypeLicense.charAt(1) == 1) ?
          {
            text: 'Perakende Satış',
            icon: 'bookmark',
            handler: () => {
              this.getProposalType(1);
              this.serverService.Settings.V3Settings.SalesType = 1;
            }
          } : { cssClass: 'display-none' },
        (this.salesTypeLicense.charAt(2) == 1) ?
          {
            text: 'Taksitli Satış',
            icon: 'bookmark',
            handler: () => {
              this.getProposalType(2);
              this.serverService.Settings.V3Settings.SalesType = 2;
            }
          } : { cssClass: 'display-none' },
        (this.salesTypeLicense.charAt(3) == 1) ?
          {
            text: 'İhracat Satış',
            icon: 'bookmark',
            handler: () => {
              this.getProposalType(3);
              this.serverService.Settings.V3Settings.SalesType = 3;
            }
          } : { cssClass: 'display-none' },
        (this.salesTypeLicense.charAt(4) == 1) ?
          {
            text: 'Peşin Satış (Hemen Teslim)',
            icon: 'bookmark',
            handler: () => {
              this.getProposalType(4);
              this.serverService.Settings.V3Settings.SalesType = 4;
            }
          } : { cssClass: 'display-none' },
        (this.salesTypeLicense.charAt(5) == 1) ?
          {
            text: 'Peşin Satış (Sonra Teslim)',
            icon: 'bookmark',
            handler: () => {
              this.getProposalType(5);
              this.serverService.Settings.V3Settings.SalesType = 5;
            }
          } : { cssClass: 'display-none' },
        {
          text: 'İptal',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
    console.log("sales type", this.serverService.Settings.V3Settings.SalesType, this.currentSalesType);

    //this.currentSalesType = this.serverService.Settings.V3Settings.SalesType;
    console.log("selectProposalType currentSalesType end", this.currentSalesType, this.serverService.Settings.V3Settings.SalesType);


    // this.clearCustomer();
    // this.clearItemsNotAlert();

  } */
  clearall(selected: any) {

    this.getProposalType(selected);
    this.serverService.Settings.V3Settings.SalesType = selected;
    this.clearCustomer();
    this.clearItemsNotAlert();
    console.log("---",this.serverService.Settings.V3Settings.SalesType);

  }

  clearItemsNotAlert() {
    this.serverService.Items = [];
    this.reset();
  }
  
  selectCustomerBtn() {
    console.log("current sales type",this.currentSalesType);
    console.log("server service sales type",this.serverService.Settings.V3Settings.SalesType);
    (!this.customer) ? this.selectCustomer() : this.customerActionSheet();
    this.serverService.Settings.V3Settings.SalesType=this.currentSalesType;
    console.log("current sales type 2 ",this.currentSalesType);
    console.log("server service sales type 2",this.serverService.Settings.V3Settings.SalesType); 

  }
  selectCustomer() {
    console.log('selectCustomer');
    this.numberCustomer = 0;
    this.navCtrl.navigateForward('tabs/proposal/customers');
  }

  goToCustomerDetail() {
    let navigationExtras: NavigationExtras = {
      state: {
        customer: this.customer,
        showImage: true
      }
    };
    this.navCtrl.navigateForward('tabs/proposal/customer-detail', navigationExtras)
  }

  clearCustomer() {
    console.log("Clear Customer");
    this.customer = undefined;
    this.CustomerNameRececipt = "Müşteri Seç";
  }

  async customerActionSheet() {
    console.log('2')
    const actionSheet = await this.actionSheetController.create({
      header: 'Müşteri İşlemleri',
      buttons: [
        {
          text: 'Müşteri Değiştir',
          icon: 'refresh',
          handler: () => {
            this.selectCustomer();
          }
        },
        {
          text: 'Müşteri Detayı',
          icon: 'clipboard',
          handler: () => {
            this.goToCustomerDetail();
          }
        },
        {
          text: 'İptal',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  selectedCustomer(value) {
    this.customer = value;
    this.getCustomerPoint(this.customer);
    this.CustomerNameRececipt = this.customer.CustomerName ? this.customer.CustomerName : this.customer.FirstName + ' ' + this.customer.LastName;
    this.CustomerCodeRececipt = this.customer.CurrAccCode;
    if (this.serverService.Settings.V3Settings.IsProductPriceByGrCode) {
      this.setCurrentPriceAll();
      this.onPlanChangedByProduct(Product, event);
    }
  }

  onPlanChangedByProduct(product, event) {
    console.log('onPlanChangedByProduct', event)
    for (let plan of this.paymentPlanGrCodeList) {
      if (plan.PaymentPlanCode == event && plan.ItemCode == product.ItemCode) {
        product.Price = plan.Price;
        this.currentUsedBarcodeArray[this.currentPlanCodeArrayCount] = product.UsedBarcode;
        this.currentPlanCodeArray[this.currentPlanCodeArrayCount] = event
        this.currentPlanCodeArrayCount++;
      }
    }
    this.CustomerProdRececipt = this.serverService.Items;
    console.log(this.CustomerProdRececipt);
    this.calculate();
  }

  showPromptPaymentPlan(product: Product, slidingItem: any) {
    if (slidingItem) slidingItem.close();

    this.paymentPlanGrCode.Parameters[0].Value = 'TR';
    this.paymentPlanGrCode.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCode;
    this.paymentPlanGrCode.Parameters[2].Value = product.ItemCode;
    this.serverService.getAny(this.paymentPlanGrCode)
      .then(res => {
        var alertInputs = [];

        for (let plan of res) {
          alertInputs.push(
            {
              type: 'radio',
              label: plan.PaymentPlanDescription,
              value: plan.PaymentPlanCode
            });
        }
        this.paymentPlanGrCodeList = res
        console.log(this.paymentPlanGrCodeList);
        if (!Array.isArray(res)) return;

        this.translateService.get(['PROPOSAL_ALERT_EDIT_TITLE_TEXT', 'PROPOSAL_ALERT_EDIT_MESSAGE_TEXT', 'PROPOSAL_ALERT_EDIT_INPUT_PRICE_PLACEHOLDER_TEXT', 'ALERT_BUTTON_CANCEL_TEXT', 'ALERT_BUTTON_SAVE_TEXT', 'PROPOSAL_ALERT_EDIT_INPUT_QUANTITY_PLACEHOLDER_TEXT']).subscribe(async (value: string[]) => {
          let prompt = await this.alertCtrl.create({
            header: 'Ödeme Planı',
            inputs: alertInputs,
            buttons: [
              {
                text: value['ALERT_BUTTON_CANCEL_TEXT'],
                handler: data => {
                  slidingItem.close();
                }
              },
              {
                text: value['ALERT_BUTTON_SAVE_TEXT'],
                handler: data => {
                  console.log(data)
                  this.installementCount = parseInt(data);
                  console.log(this.installementCount);
                  this.onPlanChangedByProduct(product, data);

                }
              }
            ]
          });
          await prompt.present();
        });

      })
      .catch(this.envService.handleError);
  }

  async showPromptSerialNumber(product: Product, slidingItem: any) {
    if (slidingItem)
      slidingItem.close();

    let alert = await this.alertCtrl.create({
      header: 'Ürün Seri Numarası Girilme Şekli',
      inputs: [
        {
          type: 'radio',
          label: 'Elle Giriş',
          value: 'Elle Giriş',

        },
        {
          type: 'radio',
          label: 'Okutularak Giriş',
          value: 'Okutularak Giriş',

        },
      ],
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'İleri',
          handler: (data: string) => {
            if (data) {
              console.log(data);
              this.showpromptEnterSerialNumber(product, data);
            } else {
              this.envService.presentAlert('Hata', 'Lütfen Bir Seçim Yapınız');
            }
          }
        }
      ]
    });
    await alert.present();
  }
  async showpromptEnterSerialNumber(product: Product, data: any) {
    if (data == "Elle Giriş") {
      let alert = await this.alertCtrl.create({
        header: 'Ürün Seri Numarası',
        inputs: [
          {
            name: 'serino',
            placeholder: 'Seri Numarası...'
          }
        ],
        buttons: [
          {
            text: 'İptal',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Kaydet',
            handler: data => {
              console.log(data);
              product.seriNumber = data.serino;
              console.log(product)
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.scanSerialNumber(product);
    }
  }

  scanSerialNumber(product: Product) {
    this.serverService.isOpenCamera = true;
    try {
      this.barcodeScanner.scan().then(barcodeData => {
        this.serverService.isOpenCamera = false;
        product.seriNumber = barcodeData.text;
      }).catch(err => {
        console.log('Error', err);
        this.serverService.isOpenCamera = false;
      });
    }
    catch (err) {
      this.serverService.isOpenCamera = false;
      console.log('Serial err: ', err);
    }
  }

  setIsSuspended() {
    if (this.serverService.Settings.V3Settings.IsSuspended) {
      this.orderData.IsSuspended = true;
    } else {
      this.orderData.IsSuspended = false
    }
  }

  selectProduct() {
    this.numberProduct = 0;
    this.navCtrl.navigateForward('tabs/proposal/products')
  }

  async orderProcessActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sipariş İşlemleri',
      buttons: [
        {
          text: 'Sipariş Seç',
          icon: 'cloud-download',
          handler: () => {
            this.selectOrder();
          }
        },
        (this.serverService.Settings.G3Settings.AddOrderDiscount) ?
          {
            text: 'Dip İskonto Ekle',
            icon: 'clipboard',
            handler: () => {
              this.showDiscountPrompt();
            }
          } : { cssClass: 'display-none' },
        {
          text: 'İptal',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  setProposalData(headerId, code) {
    this.updateProposalData.Parameters[0].Value = headerId;
    this.updateProposalData.Parameters[1].Value = code;
    this.serverService.getAny(this.updateProposalData);
  }

  setSalesPersonData(headerId, code) {
    this.updateSalesPerson.ProcName = "G4_SetSalesPersonData";
    this.updateSalesPerson.Parameters[0].Value = headerId;
    this.updateSalesPerson.Parameters[1].Value = code;
    this.serverService.getAny(this.updateSalesPerson);
  }

  setSalesPersonDataInvoice(headerId, code) {
    this.updateSalesPerson.ProcName = "G4_SetSalesPersonDataInvoice"
    this.updateSalesPerson.Parameters[0].Value = headerId;
    this.updateSalesPerson.Parameters[1].Value = code;
    this.serverService.getAny(this.updateSalesPerson);
  }

  setSalesPersonDataOthers(headerId, code) {
    this.updateSalesPerson.ProcName = "G4_SetSalesPersonData"
    this.updateSalesPerson.Parameters[0].Value = headerId;
    this.updateSalesPerson.Parameters[1].Value = code;
    this.serverService.getAny(this.updateSalesPerson);
  }

  setIsCreditableConfirmed(headerId) {
    this.updateOrderIsCompleted.Parameters[0].Value = headerId;
    this.serverService.getAny(this.updateOrderIsCompleted);
  }

  setIsCreditSaleAndIsCompleted(headerId) {
    this.updatesetIsCreditSaleAndIsCompleted.Parameters[0].Value = headerId;
    this.serverService.getAny(this.updatesetIsCreditSaleAndIsCompleted);
  }

  setOrderIsCompleted(headerId) {
    this.updateOrderData.Parameters[0].Value = headerId;
    this.serverService.getAny(this.updateOrderData);
  }

  setTrOrderPaymentPlan(headerId) {
    this.deleteTrOrderPaymentPlan.Parameters[0].Value = headerId;
    this.serverService.getAny(this.deleteTrOrderPaymentPlan);
  }

  /*setCompanyCode(headerId){         
    this.updatesetCompanyCode.Parameters[0].Value = headerId;    
    this.serverService.getAny(this.updatesetCompanyCode);
  }*/

  addSerialInvoice(InvoiceLineID, SerialNumber) {
    this.AddSerialInvoice.Parameters[0].Value = InvoiceLineID;
    this.AddSerialInvoice.Parameters[1].Value = SerialNumber;
    this.serverService.getAny(this.AddSerialInvoice);
  }

  addItemSerial(SerialNumber) {
    this.AddItemSerial.Parameters[0].Value = SerialNumber;
    this.serverService.getAny(this.AddItemSerial);
  }

  setInvoiceIsCompleted(headerId) {
    this.updateInvoiceData.Parameters[0].Value = headerId;
    this.serverService.getAny(this.updateInvoiceData);
  }

  addCurrAccUserWarning() {
    this.CustomerInfoRececipt = this.infoText;
    this.CustomerPaidRececipt = this.paid;
    if (this.infoText != null && this.paid > 0) {
      this.addData.Parameters[0].Value = this.orderData.CustomerCode;
      this.addData.Parameters[1].Value = 'Açıklama :' + this.infoText + ' ' + 'Pesinat : ' + this.paid;
      this.serverService.getAny(this.addData)
        .then(res => {
          console.log(res);

        })
        .catch(this.envService.handleError);
      console.log(this.addData.Parameters[1].Value);
    }
    else if (this.infoText != null && (this.paid == 0 || this.paid == null)) {
      this.addData.Parameters[0].Value = this.orderData.CustomerCode;
      this.addData.Parameters[1].Value = 'Açıklama :' + this.infoText;
      this.serverService.getAny(this.addData)
        .then(res => {
          console.log(res);

        })
        .catch(this.envService.handleError);
      console.log(this.addData.Parameters[1].Value);
    }
    else if (this.infoText == null && this.paid > 0) {
      this.addData.Parameters[0].Value = this.orderData.CustomerCode;
      this.addData.Parameters[1].Value = 'Pesinat : ' + this.paid;
      this.serverService.getAny(this.addData)
        .then(res => {
          console.log(res);

        })
        .catch(this.envService.handleError);
      console.log(this.addData.Parameters[1].Value);
    }
    else if (this.infoText == null && (this.paid == 0 || this.paid == null)) {
      return;
    }
  }

  reset() {
    this.infoText = '';
    this.orderTypeName = '';
    this.currentPlanCodeArrayCount = 0;
    this.currentUsedBarcodeArray = [];
    this.currentPlanCodeArray = [];
    this.serverService.Items = [];
    this.orderData.TDisRate1 = 0;
    this.customer = null;
    this.currentPlanCode = "";
    this.monthly = 0;
    this.total = 0;
    this.remain = 0;
    this.paid = 0;
    this.getProposalType(this.serverService.Settings.V3Settings.SalesType);
  }

  /*
        None = 0,
        Login = 1,
        Customer = 2,
        RetailCustomer = 3,
        Product = 4,
        OrderWS = 5,
        OrderR = 6,
        InvoiceWS = 7,
        InvoiceR = 8,
        OrderBP = 9,
        OrderCP = 10,
        OrderCS = 11,
        OrderDS = 12,
        OrderEP = 13,
        OrderES = 14,
        OrderIP = 15,
        OrderRI = 16,
        OrderSS = 17,
        OrderST = 18,
        InvoiceBP = 19,
        InvoiceCP = 20,
        InvoiceCS = 21,
        InvoiceDS = 22,
        InvoiceEP = 23,
        InvoiceES = 24,
        InvoiceIP = 25,
        InvoiceRI = 26,
        InvoiceSS = 27,
   */

  getModelType() {
    /***
     * 0 toptan
     * 1 perakende
     * 2 taksit
     * 3 ihracat
     * 4 Peşin satış (hemen teslim)
     * 5 Peşin satış (sonra teslim)
     * 
     */
    console.log("SalesType getModelType ", this.serverService.Settings.V3Settings.SalesType);
    console.log("ModelType getModelType", this.orderData.ModelType);
    if (this.serverService.Settings.V3Settings.SalesType == 0)
      return 5;
    else if (this.serverService.Settings.V3Settings.SalesType == 1)
      return 6;
    else if (this.serverService.Settings.V3Settings.SalesType == 2)
      return 16;
    else if (this.serverService.Settings.V3Settings.SalesType == 3)
      return 14;
    else if (this.serverService.Settings.V3Settings.SalesType == 4)
      return 8;
    else if (this.serverService.Settings.V3Settings.SalesType == 5)
      return 6;

    console.log("SalesType getModelType 2 ", this.serverService.Settings.V3Settings.SalesType);
    console.log("ModelType getModelType 2 ", this.orderData.ModelType);
  }

  addProposalReportOrder(result) {
    //askıda sipariş raporu START
    let ProcessCode;
    let orderNumber = result.OrderNumber
    for (let x = 0; x < orderNumber.length; x++) {
      if (orderNumber[x] == 'R') {
        if (orderNumber[x + 1] == 'I') {
          ProcessCode = orderNumber[x] + orderNumber[x + 1];
        } else {
          ProcessCode = orderNumber[x];
        }
      }
    }

    for (var n = 0; n < result.Lines.length; n++) {
      this.addProposalReport.Parameters[0].Value = result.HeaderID;
      this.addProposalReport.Parameters[1].Value = result.Lines[n].LineID;
      this.addProposalReport.Parameters[2].Value = result.StoreCode;
      this.addProposalReport.Parameters[3].Value = ProcessCode;
      this.addProposalReport.Parameters[4].Value = result.ApplicationCode;
      this.addProposalReport.Parameters[5].Value = result.CustomerCode;
      this.addProposalReport.Parameters[6].Value = result.OrderNumber;
      // this.addProposalReport.Parameters[7].Value = result.OrderDate;
      // this.addProposalReport.Parameters[8].Value = result.OrderTime;
      this.addProposalReport.Parameters[9].Value = result.Lines[n].ItemCode;
      this.addProposalReport.Parameters[10].Value = result.Lines[n].ColorCode;
      this.addProposalReport.Parameters[11].Value = result.Lines[n].ItemDim1Code;
      this.addProposalReport.Parameters[12].Value = result.Lines[n].Qty1;
      this.addProposalReport.Parameters[13].Value = result.Lines[n].SalespersonCode;
      this.addProposalReport.Parameters[14].Value = result.Lines[n].ActualPrice;
      this.addProposalReport.Parameters[15].Value = this.serverService.Settings.V3Settings.SalespersonCode;
      this.addProposalReport.Parameters[16].Value = false;

      this.serverService.getAny(this.addProposalReport);
    }
    // askıda sipariş raporu END
  }

  addProposalReportInvoice(result) {
    //askıda fatura raporu START
    let ProcessCode;
    let invoiceNumber = result.InvoiceNumber
    for (let x = 0; x < invoiceNumber.length; x++) {
      if (invoiceNumber[x] == 'R') {
        if (invoiceNumber[x + 1] == 'I') {
          ProcessCode = invoiceNumber[x] + invoiceNumber[x + 1];
        } else {
          ProcessCode = invoiceNumber[x];
        }
      }
    }

    for (var n = 0; n < result.Lines.length; n++) {
      this.addProposalReport.Parameters[0].Value = result.HeaderID;
      this.addProposalReport.Parameters[1].Value = result.Lines[n].LineID;
      this.addProposalReport.Parameters[2].Value = result.StoreCode;
      this.addProposalReport.Parameters[3].Value = ProcessCode;
      this.addProposalReport.Parameters[4].Value = result.ApplicationCode;
      this.addProposalReport.Parameters[5].Value = result.CustomerCode;
      this.addProposalReport.Parameters[6].Value = result.InvoiceNumber;
      // this.addProposalReport.Parameters[7].Value = result.OrderDate;
      // this.addProposalReport.Parameters[8].Value = result.OrderTime;
      this.addProposalReport.Parameters[9].Value = result.Lines[n].ItemCode;
      this.addProposalReport.Parameters[10].Value = result.Lines[n].ColorCode;
      this.addProposalReport.Parameters[11].Value = result.Lines[n].ItemDim1Code;
      this.addProposalReport.Parameters[12].Value = result.Lines[n].Qty1;
      this.addProposalReport.Parameters[13].Value = result.Lines[n].SalespersonCode;
      this.addProposalReport.Parameters[14].Value = result.Lines[n].ActualPrice;
      this.addProposalReport.Parameters[15].Value = this.serverService.Settings.V3Settings.SalespersonCode;
      this.addProposalReport.Parameters[16].Value = false;

      this.serverService.getAny(this.addProposalReport);
    }
    // askıda fatura raporu END
  }


  clearItems() {
    this.firstcurrent = true;
    this.translateService.get(['PROPOSAL_ALERT_CLEAR_TITLE_TEXT', 'PROPOSAL_ALERT_CLEAR_MESSAGE_TEXT', 'ALERT_BUTTON_CANCEL_TEXT', 'ALERT_BUTTON_CLEAR_TEXT']).subscribe(async (value: string[]) => {
      let prompt = await this.alertCtrl.create({
        header: value['PROPOSAL_ALERT_CLEAR_TITLE_TEXT'],
        message: value['PROPOSAL_ALERT_CLEAR_MESSAGE_TEXT'],
        buttons: [
          {
            text: value['ALERT_BUTTON_CANCEL_TEXT'],
            handler: data => {

            }
          },
          {
            text: value['ALERT_BUTTON_CLEAR_TEXT'],
            handler: data => {
              this.serverService.Items = [];
              this.reset();
            }
          }
        ]
      });
      await prompt.present();
    });
  }

  increasedecreaseNumber(index: number, type: number) {
    switch (type) {
      case 0:
        this.serverService.Items[index].Qty1++;
        break;
      case 1:
        if (this.serverService.Items[index].Qty1 > 1) this.serverService.Items[index].Qty1--;
        break;
      case 2:
        this.serverService.Items[index].Qty1 = (parseFloat(this.serverService.Items[index].Qty1) + 1).toFixed(1);
        break;
      case 3:
        if (this.serverService.Items[index].Qty1 > 1) this.serverService.Items[index].Qty1 = (parseFloat(this.serverService.Items[index].Qty1) - 1).toFixed(1);
        break;
      case 4:
        this.serverService.Items[index].Qty1 = (parseFloat(this.serverService.Items[index].Qty1) + 0.1).toFixed(1);
        break;
      case 5:
        if (this.serverService.Items[index].Qty1 > 0.1) this.serverService.Items[index].Qty1 = (parseFloat(this.serverService.Items[index].Qty1) - 0.1).toFixed(1);
        break;
    }
    if (this.serverService.Settings.V3Settings.IsProductPriceByGrCode == false || this.serverService.Settings.V3Settings.IsProductPriceByGrCode == true && this.serverService.Settings.V3Settings.SalesType != 2) {
      this.onPlanChanged(event);
    } else {
      this.onPlanChangedByProduct(Product, event);
    }
  }

  // TODO Translate methods below
  async setQuantity(index: number) {
    this.serverService.Items[index].Qty1;
    let prompt = await this.alertCtrl.create({
      header: 'Uzunluk Giriniz!',
      cssClass: 'alertDanger',
      //message: value['PROPOSAL_ALERT_EDIT_MESSAGE_TEXT'],
      inputs: [
        {
          name: 'first',
          // value: '00',
          type: 'number',
          id: 'input1',
          placeholder: '00'
        },
        {
          name: 'second',
          // value: '00',
          type: 'number',
          id: 'input2',
          placeholder: '00'
        }
      ],
      buttons: [
        {
          text: 'Geri',
          handler: data => {
          }
        },
        {
          text: 'Tamam',
          handler: data => {
            console.log(data)
            if (data.first == "") data.first = 0;
            if (data.second == "") data.second = 0;
            this.serverService.Items[index].Qty1 = data.first + '.' + data.second;
            if (this.serverService.Settings.V3Settings.IsProductPriceByGrCode == false || this.serverService.Settings.V3Settings.IsProductPriceByGrCode == true && this.serverService.Settings.V3Settings.SalesType != 2) {
              this.onPlanChanged(event);
            } else {
              this.onPlanChangedByProduct(Product, event);
            }
          }
        }
      ]
    });
    await prompt.present();
  }

  async showPromptEditProduct(index: number, product: Product, slidingItem: any) {
    if (slidingItem)
      slidingItem.close();

    let alert = await this.alertCtrl.create({
      header: 'Ürün Güncelleme',
      inputs: [
        {
          type: 'radio',
          label: 'Yeni Özel Fiyat',
          value: 'Yeni Özel Fiyat',
        },
        {
          type: 'radio',
          label: 'Tutarlı İskonto',
          value: 'Tutarlı İskonto',
        },
        {
          type: 'radio',
          label: 'Yüzdeli İskonto',
          value: 'Yüzdeli İskonto',
        },
      ],
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'İleri',
          handler: (data: string) => {
            if (data) {
              console.log(data);
              this.showPrompt(index, product, data);
            } else {
              this.envService.presentAlert('Uyarı', 'Lütfen Bir Seçim Yapınız');
            }
          }
        }
      ]
    });
    alert.present();
  }

  async showPrompt(index: number, product: Product, data) {
    if (data == "Yeni Özel Fiyat") {
      let prompt = await this.alertCtrl.create({
        header: 'Özel Fiyat',
        message: 'Yeni Özel Fiyat Giriniz!',
        inputs: [
          {
            name: 'price',
            value: product.Price.toString(),
            type: 'number',
            min: 0,
            placeholder: 'Yeni Özel Fiyat Giriniz',
          },
        ],
        buttons: [
          {
            text: 'İptal',
            handler: data => {

            }
          },
          {
            text: 'Kaydet',
            handler: data => {
              this.editProductNew(index, data);
            }
          }
        ]
      });
      await prompt.present();
    } else if (data == "Tutarlı İskonto") {
      this.translateService.get(['PROPOSAL_ALERT_EDIT_TITLE_TEXT', 'PROPOSAL_ALERT_EDIT_MESSAGE_TEXT', 'PROPOSAL_ALERT_EDIT_INPUT_PRICE_PLACEHOLDER_TEXT', 'ALERT_BUTTON_CANCEL_TEXT', 'ALERT_BUTTON_SAVE_TEXT', 'PROPOSAL_ALERT_EDIT_INPUT_QUANTITY_PLACEHOLDER_TEXT']).subscribe(async (value: string[]) => {
        let prompt = await this.alertCtrl.create({
          header: value['PROPOSAL_ALERT_EDIT_TITLE_TEXT'],
          message: "Tutarlı İskonto Yap",
          inputs: [
            {
              name: 'price',
              value: product.Price.toString(),
              type: 'number',
              min: 0,
              placeholder: value['PROPOSAL_ALERT_EDIT_INPUT_PRICE_PLACEHOLDER_TEXT'],
            },
          ],
          buttons: [
            {
              text: value['ALERT_BUTTON_CANCEL_TEXT'],
              handler: data => {

              }
            },
            {
              text: value['ALERT_BUTTON_SAVE_TEXT'],
              handler: data => {
                this.editProduct(index, data);
              }
            }
          ]
        });
        await prompt.present();
      });
    } else {
      this.translateService.get(['PROPOSAL_ALERT_EDIT_TITLE_TEXT', 'PROPOSAL_ALERT_EDIT_MESSAGE_TEXT', 'PROPOSAL_ALERT_EDIT_INPUT_PRICE_PLACEHOLDER_TEXT', 'ALERT_BUTTON_CANCEL_TEXT', 'ALERT_BUTTON_SAVE_TEXT', 'PROPOSAL_ALERT_EDIT_INPUT_QUANTITY_PLACEHOLDER_TEXT']).subscribe(async (value: string[]) => {
        let prompt = await this.alertCtrl.create({
          header: value['PROPOSAL_ALERT_EDIT_TITLE_TEXT'],
          message: "Yüzdeli İskonto Yap",
          inputs: [
            {
              name: 'pprice',
              type: 'number',
              min: 0,
              placeholder: "Yüzdelik oran giriniz..",
            },
          ],
          buttons: [
            {
              text: value['ALERT_BUTTON_CANCEL_TEXT'],
              handler: data => {

              }
            },
            {
              text: value['ALERT_BUTTON_SAVE_TEXT'],
              handler: data => {
                this.editProduct(index, data);
              }
            }
          ]
        });
        await prompt.present();
      });
    }
  }

  async showDiscountPrompt() {
    let prompt = await this.alertCtrl.create({
      header: 'ADD_DISCOUNT_TEXT',
      message: 'ADD_DISCOUNT_TEXT',
      inputs: [
        {
          name: 'discount',
          type: 'number',
          min: 1,
          placeholder: "Yüzdelik oran giriniz.."
        }
      ],
      buttons: [
        {
          text: 'ALERT_BUTTON_CANCEL_TEXT',
          handler: data => {

          }
        },
        {
          text: 'ALERT_BUTTON_SAVE_TEXT',
          handler: data => {
            this.setDiscount(data);
          }
        }
      ]
    });
    await prompt.present();
  }
  //12H647606725

  async showPromtBarcodeQty(product: Product, slidingItem: any) {
    if (slidingItem)
      slidingItem.close();

    let alert = await this.alertCtrl.create({
      header: 'Adet Bilgisi',
      inputs: [
        {
          name: 'adet',
          placeholder: 'Ürün adeti giriniz',
        }
      ],
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Kaydet',
          handler: data => {
            console.log(data);
            product.Qty1 = data.adet;
            console.log(product)
          }
        }
      ]
    });
    await alert.present();
  }

  optionsFn() {
    console.log(this.place);
    this.orderData.TaxTypeCode = this.place;
  }

}
