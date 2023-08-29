//1702
import { Component, OnInit ,AfterViewInit,AfterContentInit} from '@angular/core';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { Product, ProductDetails } from 'src/app/models/models';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements AfterContentInit {

  sliderConfig = {
    slidesPerView: 2,
    spaceBetween: 10
  };

  userData = {
    "ProcName": "",
    "Parameters": [{ "Name": "ItemCode", "Value": "" }]
  };
  pricesData = {
    "ProcName": "G4_GetProductPrices",
    "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "PriceGroupCode", "Value": "" }]
  };
  storeData = {
    "ProcName": "",
    "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "WarehouseCode", "Value": "" }]
  };
  barcodeData = {
    "ProcName": "G4_GetProductPriceByBarcode",
    "Parameters": [{ "Name": "Barcode", "Value": "" }, { "Name": "PriceGroupCode", "Value": "" }]
  };
  getBarcodeData = {
    "ProcName": "G4_GetProductBarcode1",
    "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "ColorCode", "Value": "" },
    { "Name": "ItemDim1Code", "Value": "" }]
  };

  getAvailableInventoryV3 = {
    "ProcName": "G4_GetAvailableInventoryNew",
    "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "ColorCode", "Value": "" }]
  };

  PaymentPlanProduct = {
    "ProcName": "G4_GetPaymentPlanByItemCode",
    "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "PriceGroupCode", "Value": "" },
    { "Name": "Language", "Value": "" }
    ]
  };
  pageRoute: any;
  count: number = 0;
  salesTypeLicense: any;

  product: Product;
  productInventory: any;
  productDetails: ProductDetails;
  productPrices: any[] = [];
  productPricesWS: any[] = [];
  productPricesIF: any[] = [];
  productColorSizeMatrix: any[] = [];
  productColorSizeMatrixNew: any[] = [];
  productColors: any[] = [];
  tempItemDim: any[] = [];
  colHeaders: any;
  imageURL: any;
  color: string;
  tempMaxQty: number = 0;
  ModuleLicense: string;
  selectedSize: any;
  alternatives: any[] = [];
  sizes: any;
  barcode: string;
  quantity: number;
  quantities: number[] = [];
  advancePrice: any;
  PaymentPlanProductList: any[] = [];
  PaymentPlanProductListWS: any[] = [];
  tempPaymentPlanProductList: any[] = [];
  temp2PaymentPlanProductList: any[] = [];
  PaymentPlanDescriptions: any[] = [];
  currency: string = "₺";
  mesureCodeDesc: any;
  productSelectedQuantityMatrix = [{ "Size": "", "MaxQuantity": <number>{}, "SelectedQuantity": "" }];
  productSelectedQuantityMatrix2 = [{ "Size": "", "MaxQuantity": <number>{}, "SelectedQuantity": "" }];
  id: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    public navCtrl: NavController, public envService: EnvService, public modalCtrl: ModalController, public alertCtrl: AlertController,
    public serverService: ServerService, public translateService: TranslateService) {
    this.currency = serverService.Settings.G3Settings.Currency;
    this.ModuleLicense = serverService.Settings.G3License.Modules;
    this.salesTypeLicense = this.serverService.Settings.G3License.SalesTypes;
    serverService.isOpenCamera = false;
    this.pageRoute = this.router.routerState.snapshot.url
    console.log(this.router)
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.product = this.router.getCurrentNavigation().extras.state.product;
        console.log(this.product)
      }
    });
  }

  ngAfterContentInit() {
    this.envService.presentLoading();
    this.imageURL = this.serverService.Settings.G3Settings.ImageUrl + '/Home/GetImage?itemcode=' + this.product.ItemCode;
    this.getAlternativeProducts();
    this.getProductDetails();
    this.getProductPricesWithItemCode();
    this.getProductPricesWithItemCodeWS();

    // if (this.serverService.Settings.Integrator.DatabaseName == 'YALISPOR_V3') { // TODO
    //   this.getProductPricesWithItemCodeIF();
    // }
    this.getProductInventory();
    this.getItemDim1s();
    this.getProductColorSizeMatrix();
    this.getProductPricesWithBarcode();
    this.getProductPricesWithBarcodeWS();

    console.log("SAles Typee", this.salesTypeLicense);

  }

  gotoProductOtherStores() {
    let navigationExtras: NavigationExtras = {
      state: {
        ItemCode: this.product.ItemCode
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/product-otherstores`, navigationExtras);
  }

  gotoProductWarehouse() {
    let navigationExtras: NavigationExtras = {
      state: {
        product: this.product,
        productPrices: this.PaymentPlanProductList,
        colHeaders: this.colHeaders,
        productColorSizeMatrix: this.productColorSizeMatrix,
        PaymentPlanDescriptions: this.PaymentPlanDescriptions,
      }
    }
    this.navCtrl.navigateForward(`${this.pageRoute}/product-warehouse`, navigationExtras);
  }

  getProductDetails() {
    this.storeData.ProcName = "G4_GetProductDetails";
    this.storeData.Parameters[0].Value = this.product.ItemCode;
    this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
    this.serverService.getAny(this.storeData).then(res => {
      console.log('G4_GetProductDetails', res);
      this.productDetails = res[0];
    }).catch(error => this.envService.handleError(error));
  }

  getProductPricesWithItemCode() {
    this.pricesData.Parameters[0].Value = this.product.ItemCode;
    this.pricesData.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCode;
    this.serverService.getProductPrices(this.pricesData).then(res => {
      if (res) {
        this.productPrices = res;
        console.log('G4_GetProductPrices', this.productPrices);
      }
    }).catch(error => this.envService.handleError(error));
  }

  getProductPricesWithBarcode() {
    this.getBarcodeData.Parameters[0].Value = this.product.ItemCode;
    console.log("color", this.color);
    this.getBarcodeData.Parameters[1].Value = this.color ? this.color : '';
    console.log("size", this.selectedSize);
    this.getBarcodeData.Parameters[2].Value = this.selectedSize ? this.selectedSize : '';

    console.log(this.getBarcodeData);
    this.serverService.getAny(this.getBarcodeData).then(res => {
      console.log(res);
      this.product.UsedBarcode = res[0].Barcode;
      this.barcodeData.Parameters[0].Value = res[0].Barcode;
      this.barcodeData.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCode;
      this.serverService.getProductPrice(this.barcodeData).then(res => {
        console.log('getProductPricesWithBarcode', res);
        if (res != null) {
          this.PaymentPlanProductList = res.PriceList;
          for (let n = 0; n < this.PaymentPlanProductList.length; n++) {
            if (this.PaymentPlanProductList[n].PaymentPlanCode == "X03" || this.PaymentPlanProductList[n].PaymentPlanCode == "X06" || this.PaymentPlanProductList[n].PaymentPlanCode == "X12") {
              this.PaymentPlanProductList.splice(n, 1);
              n--;
            }
          }
        }
        this.getPaymentPlanDescription();

      }).catch(error => this.envService.handleError(error));
    }).catch(error => this.envService.handleError(error));
  }

  getProductPricesWithItemCodeWS() {
    this.pricesData.Parameters[0].Value = this.product.ItemCode;
    this.pricesData.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCodeWs;
    this.serverService.getProductPrices(this.pricesData).then(res => {
      if (res) {
        this.productPricesWS = res;
        console.log('G4_GetProductPrices', this.productPricesWS);
      }
      else return
    }).catch(error => this.envService.handleError(error));
  }

  getProductPricesWithBarcodeWS() {
    this.getBarcodeData.Parameters[0].Value = this.product.ItemCode;
    console.log("color", this.color);
    this.getBarcodeData.Parameters[1].Value = this.color ? this.color : '';
    console.log("size", this.selectedSize);
    this.getBarcodeData.Parameters[2].Value = this.selectedSize ? this.selectedSize : '';

    console.log(this.getBarcodeData);
    this.serverService.getAny(this.getBarcodeData).then(res => {
      console.log(res);
      this.product.UsedBarcode = res[0].Barcode;
      this.barcodeData.Parameters[0].Value = res[0].Barcode;
      this.barcodeData.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCodeWs;
      this.serverService.getProductPrice(this.barcodeData).then(res => {
        console.log('getProductPricesWithBarcode', res);
        if (res != null) {
          this.PaymentPlanProductListWS = res.PriceList;
          for (let n = 0; n < this.PaymentPlanProductListWS.length; n++) {
            if (this.PaymentPlanProductListWS[n].PaymentPlanCode == "X03" || this.PaymentPlanProductListWS[n].PaymentPlanCode == "X06" || this.PaymentPlanProductListWS[n].PaymentPlanCode == "X12") {
              this.PaymentPlanProductListWS.splice(n, 1);
              n--;
            }
          }
        }
        this.getPaymentPlanDescription();

      }).catch(error => this.envService.handleError(error));
    }).catch(error => this.envService.handleError(error));
  }

  // getProductPricesWithItemCodeIF() {
  //   this.pricesData.Parameters[0].Value = this.product.ItemCode;
  //   this.pricesData.Parameters[1].Value = 'IF';
  //   this.serverService.getProductPrices(this.pricesData).then(res => {
  //     if (res) {
  //       this.productPricesIF = res;
  //       console.log('G4_GetProductPricesIF', this.productPricesIF);
  //     }
  //   }).catch(error => this.envService.handleError(error));
  // }

  getAlternativeProducts() {
    this.userData.ProcName = "G4_GetAlternativeProducts";
    this.userData.Parameters[0].Value = this.product.ItemCode;
    this.serverService.getAny(this.userData).then(res => {
      this.alternatives = res;
      console.log('Alternatives');
      console.log(this.alternatives);
    }).catch(error => this.envService.handleError(error));
  }

  getPriceGroup(item: string) {
    var tempPriceGroupCode: string;
    if (item == null) return;

    else if (item.charAt(0) == "€") {
      tempPriceGroupCode = '€'
      return tempPriceGroupCode;
    } else if (item.charAt(0) == "$") {
      tempPriceGroupCode = '$'
      return tempPriceGroupCode;
    } else {
      tempPriceGroupCode = '₺'
      return tempPriceGroupCode;
    }
  }

  getProductInventory() {
    this.userData.ProcName = "G4_GetProductInventory";
    console.log(this.userData);
    this.serverService.getAny(this.userData).then(res => {
      if (res) {
        console.log('Inventory');
        console.log(res);
        this.productInventory = res;
      }

    }).catch(error => this.envService.handleError(error));
  }

  getItemDim1s() {
    this.userData.ProcName = "G4_GetItemDim1s";
    this.userData.Parameters[0].Value = this.product.ItemCode;
    this.serverService.getAny(this.userData).then(res => {
      console.log('G4_GetItemDim1s', res);
      if (res) {
        if (res[0].ItemDim1Code == "R/B") res.splice(0, 1)
        this.colHeaders = res;
      }

    }).catch(error => this.envService.handleError(error));
  }

  getProductColorSizeMatrix() {
    this.storeData.ProcName = "G4_GetProductColorSizeMatrix";
    this.storeData.Parameters[0].Value = this.product.ItemCode;
    this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
    this.serverService.getAny(this.storeData).then(res => {
      console.log('G4_GetProductColorSizeMatrix', res);
      console.log(this.product.ItemCode, this.serverService.Settings.V3Settings.WarehouseCode)
      if (res.length > 0 && JSON.stringify(res).toString().indexOf('Exception') == -1) {
        this.productColorSizeMatrix = res;
        if (!this.color && this.productColorSizeMatrix[0]['R/B']) {
          this.color = this.productColorSizeMatrix[0]['R/B'];
          console.log("this.color", this.color);
        }

        if (this.color) {
          this.sizes = this.productColorSizeMatrix.find(x => x['R/B'] == this.color);
          console.log("this.sizes", this.sizes);
        }

        if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
          this.getAvailableInventory(this.color);
        }
      } else {// sadece renk
        this.storeData.ProcName = "G4_GetProductColors";
        this.storeData.Parameters[0].Value = this.product.ItemCode;
        this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
        this.serverService.getAny(this.storeData).then(res => {
          console.log(res);
          if (res.length > 0 && this.productColorSizeMatrix.length == 0 && ((res.length == 1 || res.length == 2) && res[0].ColorCode != "")) {
            this.productColors = res;
            console.log(this.serverService.getColorDescription(res[0].ColorCode))
          }
        })
      }
    }).catch(error => this.envService.handleError(error));
  }

  getAvailableInventory(val1) {
    this.getAvailableInventoryV3.Parameters[0].Value = this.product.ItemCode;
    this.getAvailableInventoryV3.Parameters[1].Value = val1 ? val1 : '';
    this.serverService.getAny(this.getAvailableInventoryV3).then(res => {
      this.productColorSizeMatrixNew = res;
      console.log('G4_getAvailableInventory', this.productColorSizeMatrixNew);
    }).catch(error => this.envService.handleError(error));
  }

  setSizes() {
    if (this.color) {
      this.selectedSize = null;
      this.quantity = null;
      this.quantities = [];
      this.sizes = this.productColorSizeMatrix.find(x => x['R/B'] == this.color);
      if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
        this.getAvailableInventoryV3.Parameters[0].Value = this.product.ItemCode;
        this.getAvailableInventoryV3.Parameters[1].Value = this.color ? this.color : '';
        this.serverService.getAny(this.getAvailableInventoryV3).then(res => {
          this.productColorSizeMatrixNew = res;
          console.log(this.productColorSizeMatrixNew)
        }).catch(error => this.envService.handleError(error));
      }
    }
    console.log('sizes');
    console.log(this.sizes);
  }





  getPaymentPlanDescription() {
    let planData = { "ProcName": "G4_GetPaymentPlanDesc", "Parameters": [{ "Name": "Language", "Value": "TR" }] };
    this.serverService.getAny(planData).then(res => {
      console.log(res, this.serverService.Settings.G3Settings.UseInventoryInProductDetail);
      if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
        for (let x of this.PaymentPlanProductList) {
          if (this.tempPaymentPlanProductList.indexOf(x.PaymentPlanCode) < 0) {
            this.tempPaymentPlanProductList.push(x.PaymentPlanCode);
            this.temp2PaymentPlanProductList.push(x);
          }
        }
        console.log(this.temp2PaymentPlanProductList);
        this.PaymentPlanProductList = this.temp2PaymentPlanProductList;
      }
      for (let i = 0; i < this.PaymentPlanProductList.length; i++) {
        for (let n = 0; n < res.length; n++) {
          if (this.PaymentPlanProductList[i].PaymentPlanCode == res[n].PaymentPlanCode) {
            if (res[n].PaymentPlanCode == "") res[n].PaymentPlanDescription = "Peşin";
            this.PaymentPlanDescriptions.push(res[n].PaymentPlanDescription)
          }
        }
      }

      /*if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
       this.gotoProductWarehouse();
     }*/
    })
  }


  setSelectedSize() {
    let size: any;

    if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
      for (let item of this.productColorSizeMatrixNew) {
        if (item.ItemDim1Code == this.selectedSize) size = item;
      }
      if (size.AvailableInventoryQty1 > 0) {
        this.tempMaxQty = size.AvailableInventoryQty1;
        this.selectedSize = size.ItemDim1Code;
        this.quantities = [];
        for (let i = 0; i < size.AvailableInventoryQty1; i++) this.quantities.push(i + 1);
        this.quantity = 1;
      }
    } else {
      if (this.sizes[this.selectedSize] > 0) {
        this.tempMaxQty = this.sizes[this.selectedSize];
        this.quantities = [];
        for (let i = 0; i < this.sizes[this.selectedSize]; i++) this.quantities.push(i + 1);
        this.quantity = 1;
      }
    }
  }

  showImage() {
    let url = this.imageURL;
    url += (this.color) ? ('&colorcode=' + this.color) : '';
    //this.photoViewer.show(url);
  }

  addToBasket() {

    console.log("Currenntt Sales type ", this.serverService.Settings.V3Settings.SalesType);

    if (this.ModuleLicense.charAt(2) != "0") {
      if (this.productColorSizeMatrix && this.sizes) {
        if (!this.color) {
          this.envService.presentAlert('Lütfen renk seçeniz.', 'Bilgi');
          return;
        }
        if (!this.selectedSize && !this.product.ItemDim1Code) {
          this.envService.presentAlert('Lütfen beden seçeniz.', 'Bilgi');
          return;
        }
        if (this.quantity == 0) {
          this.envService.presentAlert('adet seciniz', "bilgi");
          return;
        }
      }
      this.addProduct();
    } else {
      this.envService.presentAlert('Lisansınız bu işlem için aktif değildir.', 'UYARI');
    }
  }


  addProduct() {
    this.envService.presentLoading();
    this.getBarcodeData.Parameters[0].Value = this.product.ItemCode;
    this.getBarcodeData.Parameters[1].Value = this.color ? this.color : '';
    this.getBarcodeData.Parameters[2].Value = this.selectedSize ? this.selectedSize : '';

    console.log("barcodedata", this.getBarcodeData);
    this.serverService.getAny(this.getBarcodeData).then(res => {
      console.log(res);
      this.product.UsedBarcode = res[0].Barcode;
      console.log("product detail", this.productDetails);
      console.log("UseInventoryInProductDetail", this.serverService.Settings.G3Settings.UseInventoryInProductDetail);
      //TODO JS4 MesureCode standart gelsin
      if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
        this.product.MesureCode = res[0].MesureCode;
        this.product.Qty1 = res[0].Qty1;
      } else {
        this.product.MesureCode = "AD";
      }

      this.barcodeData.Parameters[0].Value = res[0].Barcode;
      if (this.serverService.Settings.V3Settings.SalesType == 1 || this.serverService.Settings.V3Settings.SalesType == 2 || this.serverService.Settings.V3Settings.SalesType == 4 || this.serverService.Settings.V3Settings.SalesType == 5) {
        this.barcodeData.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCode;
      }
      else if (this.serverService.Settings.V3Settings.SalesType == 0 || this.serverService.Settings.V3Settings.SalesType == 3) {
        this.barcodeData.Parameters[1].Value = this.serverService.Settings.V3Settings.PriceGroupCodeWs;
      }

      this.serverService.getProductPrice(this.barcodeData).then(res => {
        console.log("getproductprice ->",res);
        console.log("colorssss", this.productColorSizeMatrixNew);
        this.product.PriceList = res.PriceList;
        this.product.BarcodeType = res.BarcodeType;
        console.log("this product detail", this.productDetails);
        this.productDetails.RetailSalePrice = res.PriceList[0].Price;
        this.product.LDisRate1 = 0;
        this.product.MaxQty = this.tempMaxQty;
        if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
          console.log("colorCode", res.ColorCode);
          this.product.ColorCode = res.ColorCode ? res.ColorCode : "";
          this.product.ItemDim1Code = this.selectedSize;
          this.quantity = this.product.Qty1 * this.quantity;

        } /*else {
          this.product.ColorCode = this.color;
          this.product.ItemDim1Code = this.selectedSize;
          this.quantity=this.product.Qty1 * this.quantity;
        }*/
        console.log("product-detail ", this.product);
        this.product.Content = this.productDetails.ProductAtt08Desc ? this.productDetails.ProductAtt08Desc : '';
        this.pushProduct();
        this.envService.dismissLoading();
      }).catch(error => this.envService.handleError(error));
    }).catch(error => this.envService.handleError(error));
  }

  pushProduct() {
    console.log("quantity", this.quantity);
    this.product.Qty1 = this.quantity ? this.quantity : 1;
    console.log("qty1", this.product.Qty1);

    for (let item of this.serverService.Items) {
      if (item.ItemCode == this.product.ItemCode && item.UsedBarcode == this.product.UsedBarcode) {
        item.Qty1 += this.product.Qty1;
        return
      }
    }
    console.log("this.productDetails.RetailSalePrice", this.productDetails.RetailSalePrice);
    this.product.Price = this.productDetails.RetailSalePrice;
    this.serverService.Items.push(this.product);
    this.selectedSize = null;
    this.quantity = null;
    this.quantities = [];
  }

  async goToAlternativeProductDetail(product: Product) {
    let modal = await this.modalCtrl.create({
      component: ProductDetailPage,
      componentProps: {
        product: this.product
      },
    });
    this.modalCtrl.dismiss(product);
    await modal.present();
  }

  goToAlternativeProductDetail3(product: Product) {
    let navigationExtras: NavigationExtras = {
      state: {
        product: product
      }
    }
    this.navCtrl.navigateRoot(`${this.pageRoute}`, navigationExtras);
    console.log(navigationExtras)
  }
  // async presentAlertConfirm() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Satış Tipi Seçiniz',

  //     buttons: [
  //       {
  //         text: 'Toptan Satış',
  //         handler: () => {
  //           if (this.serverService.Settings.V3Settings.SalesType == 0 || this.serverService.Settings.V3Settings.SalesType == 3) {
  //             this.addToBasket();
  //           }
  //           else {
  //             this.envService.presentAlert('Bilgi', 'Lütfen Sipariş Sayfasından Satış Tipini Kontrol Ediniz');
  //             this.addToBasket();
  //           }
  //         }
  //       }, {
  //         text: 'Perakende Satış',
  //         handler: () => {
  //           if (this.serverService.Settings.V3Settings.SalesType == 1 || this.serverService.Settings.V3Settings.SalesType == 2 || this.serverService.Settings.V3Settings.SalesType == 4 || this.serverService.Settings.V3Settings.SalesType == 5) {
  //             this.addToBasket();
  //           }
  //           else {
  //             this.envService.presentAlert('Bilgi', 'Lütfen Sipariş Sayfasından Satış Tipini Kontrol Ediniz');
  //             this.addToBasket();
  //           }
  //         }
  //       }, {
  //         text: 'İptal',
  //         role: 'cancel'

  //       }
  //     ]
  //   });

  //   await alert.present();
  // }


}




// gotoAllProductWarehousePage() {
//   this.navCtrl.push(OtherwarehousePage, { warehouseproducts: this.product.ItemCode });
// }

// gotoInventoryPage() {
//   if (this.color && this.sizes && this.colHeaders) {
//     let sizesZero: any[] = [];
//     for (let size of this.colHeaders) {
//       if (size.ItemDim1Code != 'R/B' && this.sizes[size.ItemDim1Code] < 1)
//         sizesZero.push(size.ItemDim1Code);
//     }
//     let inventoryList: any[] = [];
//     for (let size of sizesZero) {
//       for (let inventory of this.productInventory) {
//         if (inventory.ColorCode == this.color && inventory.ItemDim1Code == size && inventory.StoreCode != this.serverService.Settings.V3Settings.StoreCode)
//           inventoryList.push(inventory);
//       }
//     }
//     if (inventoryList.length > 0) {
//       this.navCtrl.push(InventoryPage, { productInventory: inventoryList });
//     }
//     else {
//       this.presentAlert("Bilgi", "Mağaza stoklarınızda olmayan ürünler diğer mağaza stoklarında da yok...");
//     }
//   }
// } 

// gotoWarehousePage() {
//   this.navCtrl.push(WarehousePage, {
//     product: this.product,
//     productPrices: this.PaymentPlanProductList,
//     colHeaders: this.colHeaders,
//     productColorSizeMatrix: this.productColorSizeMatrix,
//     PaymentPlanDescriptions: this.PaymentPlanDescriptions,      
//   });
// }

