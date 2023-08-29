import { Component, OnInit } from '@angular/core';
import { EnvService } from 'src/app/services/env.service';
import { ServerService } from 'src/app/services/server.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Product, ProductDetails } from 'src/app/models/models';

@Component({
  selector: 'app-product-select-product',
  templateUrl: './product-select-product.page.html',
  styleUrls: ['./product-select-product.page.scss'],
})
export class ProductSelectProductPage implements OnInit {


  userData = {
    "ProcName": "G4_ProductListNEW",
    "Parameters": [{ "Name": "ItemDescription", "Value": "" }, { "Name": "ItemCode", "Value": "" }, { "Name": "AttributeCode", "Value": "" }
      , { "Name": "AttributeType", "Value": "" }]
  };
  productData = { "ProcName": "", "Parameters": [{ "Name": "ItemCode", "Value": "" }] };
  storeData = { "ProcName": "", "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "WarehouseCode", "Value": "" }] };
  barcodeData = {
    "ProcName": "G4_GetProductPriceByBarcode",
    "Parameters": [{ "Name": "Barcode", "Value": "" }, { "Name": "PriceGroupCode", "Value": "" }]
  };
  getBarcodeData = {
    "ProcName": "G4_GetProductBarcodeSelectPage", "Parameters": [{ "Name": "ItemCode", "Value": "" },
    { "Name": "ColorCode", "Value": "" }, { "Name": "ItemDim1Code", "Value": "" }]
  };

  getAvailableInventoryV3 = {
    "ProcName": "G4_GetAvailableInventoryNew", "Parameters": [{ "Name": "ItemCode", "Value": "" },
    { "Name": "ColorCode", "Value": "" }]
  };

  public myInput: string = "";
  public attributeCode: string = "";
  imageURL: any;
  checklog: boolean = false;
  selectedQuantityP: string = "1";
  selectedSize: string;
  mesureCodeDesc: any;
  public items: Product[] = new Array();

  product: Product;
  productDetails: ProductDetails;
  productColorSizeMatrix: any[] = [];
  productColorSizeMatrixNew: any[] = [];
  productColors: any[] = [];
  colHeaders: any;
  pageRoute: any;
  color: string;
  sizes: any;
  productSelectedQuantityMatrix = [{ "Size": "", "MaxQuantity": <number>{}, "SelectedQuantity": "" }];
  productSelectedQuantityMatrix2 = [{ "Size": "", "MaxQuantity": <number>{}, "SelectedQuantity": "" }];

  PriceTypeCodee: any;

  constructor(
    public serverService: ServerService, public envService: EnvService,
    public translateService: TranslateService, private activatedRoute: ActivatedRoute, private router: Router,
    public navCtrl: NavController

  ) {
    this.pageRoute = this.router.routerState.snapshot.url;
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.product = this.router.getCurrentNavigation().extras.state.product;
        this.selectProduct(this.product)
        console.log(this.router.getCurrentNavigation().extras.state.product)
      }
    });
  }

  ngOnInit() {

    if (this.serverService.Settings.V3Settings.SalesType == 0 || this.serverService.Settings.V3Settings.SalesType == 3) {
      this.PriceTypeCodee = this.serverService.Settings.V3Settings.PriceGroupCodeWs;
      //console.log("SalesTypeCodee1",this.SalesTypeCodee,this.serverService.Settings.V3Settings.PriceGroupCode,this.serverService.Settings.V3Settings.PriceGroupCodeWs);
    } else {
      this.PriceTypeCodee = this.serverService.Settings.V3Settings.PriceGroupCode;
    }
    console.log("sales type on init : ",this.serverService.Settings.V3Settings.SalesType);
  }

  dismiss() {
    this.router.navigate(['tabs/proposal'], { queryParams: { result: true } })
  }



  selectProduct(product: Product) {

    if (product) {
      this.envService.presentLoading();
      this.imageURL = this.serverService.Settings.G3Settings.ImageUrl + '/Home/GetImage?itemcode=' + this.product.ItemCode;

      this.storeData.ProcName = "G4_GetProductDetails";
      this.storeData.Parameters[0].Value = product.ItemCode;
      this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
      this.serverService.getAny(this.storeData).then(res => {

        this.productDetails = res[0];
        console.log("G4_GetProductDetails Product Select Page", res);
      }).catch(error => this.envService.handleError(error));

      this.productData.Parameters[0].Value = product.ItemCode;
      this.productData.ProcName = "G4_GetItemDim1s";
      this.serverService.getAny(this.productData).then(res => {
        if (res) {
          this.colHeaders = res;

          this.storeData.ProcName = "G4_GetProductColorSizeMatrix";
          this.storeData.Parameters[0].Value = product.ItemCode;
          this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
          this.serverService.getAny(this.storeData).then(res => {

            this.envService.dismissLoading();
            if (res.length > 0 && JSON.stringify(res).toString().indexOf('Exception') == -1) {
              this.productColorSizeMatrix = res;
              if (!this.color && this.productColorSizeMatrix[0]['R/B'])
                this.color = this.productColorSizeMatrix[0]['R/B'];
              if (this.color) {
                this.setSizes();
              }
            } else {// sadece renk
              this.storeData.ProcName = "G4_GetProductColors";
              this.storeData.Parameters[0].Value = product.ItemCode;
              this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
              this.serverService.getAny(this.storeData).then(res => {
                console.log(res);
                // altakki satir, altakki if ten kaldırıldı
                // && ((res.length ==1 || res.length ==2) && res[0].ColorCode != "") 

                if (res.length > 0 && this.productColorSizeMatrix.length == 0) {
                  this.productColors = res;
                  console.log(this.serverService.getColorDescription(res[0].ColorCode))
                }
              })
            }
          }).catch(error => this.envService.handleError(error));
        }
        else {
          this.envService.dismissLoading();
        }
      }).catch(error => this.envService.handleError(error));
    }
    else this.router.navigate(['tabs/proposal'], { queryParams: { result: false } })
  }

  getAvailableInventory(val) {
    this.productSelectedQuantityMatrix2 = [];
    this.getAvailableInventoryV3.Parameters[0].Value = this.product.ItemCode;
    this.getAvailableInventoryV3.Parameters[1].Value = val;
    this.serverService.getAny(this.getAvailableInventoryV3).then(res => {
      console.log('G4_getAvailableInventory');
      console.log(res);
      this.productColorSizeMatrixNew = res;
      for (let x of this.productColorSizeMatrixNew) {
        let count: number = x.AvailableInventoryQty1;
        this.productSelectedQuantityMatrix2.push({
          Size: x.ItemDim1Code,
          MaxQuantity: count,
          SelectedQuantity: "0"
        });
      }
      console.log(this.productSelectedQuantityMatrix2);
    }).catch(error => this.envService.handleError(error));
  }

  public setSizes() {
    this.sizes = this.productColorSizeMatrix.find(x => x['R/B'] == this.color);
    if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail == true) {
      this.getAvailableInventory(this.color);
    }
    this.productSelectedQuantityMatrix = [];
    for (let col of this.colHeaders) {
      if (col.ItemDim1Code != 'R/B' && col.ItemDim1Code != '') {
        let max: number = this.sizes[col.ItemDim1Code];
        this.productSelectedQuantityMatrix.push({
          Size: col.ItemDim1Code,
          MaxQuantity: max,
          SelectedQuantity: ""
        });
      }
    }
    console.log('sizes');
    console.log(this.sizes);
  }



  addToBasket() {
    let count: number = 0;
    if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail == true) {
      if (this.sizes) {
        for (let item of this.productSelectedQuantityMatrix2) {
          count += Number(item.SelectedQuantity);
        }
        if (count > 0) {
          if (this.productColorSizeMatrix && this.sizes) {
            if (!this.color) {
              this.envService.presentAlert('Bilgi', 'Lütfen renk seçeniz.');
              return;
            }
          }
          this.addProduct();
        }
        else {
          this.translateService.get('SELECT-PRODUCT_NO_PRODUCT_TO_ADD_BASKET_MESSAGE_TEXT').subscribe((value: string) => {
            this.envService.presentToast(value);
          });
        }
      } else {
        this.addProductwithItemCode();
      }
    } else {
      if (this.sizes) {
        for (let item of this.productSelectedQuantityMatrix) {
          count += Number(item.SelectedQuantity);
        }
        if (count > 0) {
          if (this.productColorSizeMatrix && this.sizes) {
            if (!this.color) {
              this.envService.presentAlert('Bilgi', 'Lütfen renk seçeniz.');
              return;
            }
          }
          this.addProduct();
        }
        else {
          this.translateService.get('SELECT-PRODUCT_NO_PRODUCT_TO_ADD_BASKET_MESSAGE_TEXT').subscribe((value: string) => {
            this.envService.presentToast(value);
          });
        }
      } else {
        this.addProductwithItemCode();
      }
    }
  }

  addProduct() {
    this.envService.presentLoading();
    console.log("G3Settings.UseInventoryInProductDetail", this.serverService.Settings.G3Settings.UseInventoryInProductDetail)
    if (this.serverService.Settings.G3Settings.UseInventoryInProductDetail == true) {
      for (let item of this.productSelectedQuantityMatrix2) {
        if (Number(item.SelectedQuantity) > 0) {
          this.getBarcodeData.Parameters[0].Value = this.product.ItemCode;
          this.getBarcodeData.Parameters[1].Value = this.color ? this.color : '';
          this.getBarcodeData.Parameters[2].Value = item.Size ? item.Size : '';
          this.serverService.getAny(this.getBarcodeData).then(res => { //G4_GetProductBarcodeSelectPage
            let current: Product = new Product();
            current.ItemCode = this.product.ItemCode;
            current.ItemDescription = this.product.ItemDescription;

            console.log("mesurecodedesc", this.productDetails.MesureCodeDesc);
            current.MesureCode = res[0].MesureCode;
            console.log("mesurecode", current.MesureCode);
            current.Qty1 = this.product.Qty1;
            console.log(res)
            console.log("barcode", res[0].Barcode);
            current.UsedBarcode = res[0].Barcode;
            console.log("prod det 1", this.productDetails);
            this.barcodeData.Parameters[0].Value = res[0].Barcode;
            console.log("pricegroup 222", this.serverService.Settings.V3Settings.PriceGroupCode);
            this.barcodeData.Parameters[1].Value = this.PriceTypeCodee;
            this.serverService.getProductPrice(this.barcodeData).then(res => { //G4_GetProductPriceByBarcode
              console.log("res1", res);
              current.MesureCode = this.productDetails.MesureCode;
              current.MesureCodeDesc1 = this.productDetails.MesureCodeDesc;
              current.PriceList = res.PriceList;
              current.LDisRate1 = 0;
              current.Content = this.productDetails.ProductAtt08Desc ? this.productDetails.ProductAtt08Desc : '';
              current.ColorCode = this.productColorSizeMatrixNew[0]['ColorCode'];
              current.ItemDim1Code = item.Size;
              current.Qty1 = parseInt(item.SelectedQuantity);
              current.MaxQty = item.MaxQuantity;
              current.BarcodeType = res.BarcodeType;

              console.log('current 1', current);
              this.pushProduct(current);

              this.dismiss();
              this.envService.dismissLoading();
            }).catch(error => this.envService.handleError(error));
          }).catch(error => this.envService.handleError(error));
        }
      }
      this.translateService.get('SELECT-PRODUCT_PRODUCTS_ADDED_TO_BASKET_SUCCESSFULLY_MESSAGE_TEXT').subscribe((value: string) => {
        this.envService.presentToast(value);
      });
    } else {
      for (let item of this.productSelectedQuantityMatrix) {
        if (Number(item.SelectedQuantity) > 0) {
          this.getBarcodeData.Parameters[0].Value = this.product.ItemCode;
          this.getBarcodeData.Parameters[1].Value = this.color ? this.color : '';
          this.getBarcodeData.Parameters[2].Value = item.Size ? item.Size : '';
          this.serverService.getAny(this.getBarcodeData).then(res => {
            console.log("barcode data", res);
            let current: Product = new Product();
            current.ItemCode = this.product.ItemCode;
            current.ItemDescription = this.product.ItemDescription;
            console.log("this product", this.product)
            current.MesureCode = res[0].MesureCode;
            current.MesureCodeDesc1 = this.productDetails.MesureCodeDesc;
            current.UsedBarcode = res[0].Barcode;
            console.log("barcode", res[0].Barcode);
            this.barcodeData.Parameters[0].Value = res[0].Barcode;
            this.barcodeData.Parameters[1].Value = this.PriceTypeCodee;
            console.log("pricegroup", this.PriceTypeCodee);
            console.log("res2", res);
            console.log("prod det 2", this.productDetails);
            this.serverService.getProductPrice(this.barcodeData).then(res => { //G4_GetProductPriceByBarcode
              console.log("get product price data", res);
              console.log("productDetails", this.productDetails);
              current.MesureCode = res.MesureCode;
              current.MesureCodeDesc1 = this.productDetails.MesureCodeDesc;
              current.PriceList = res.PriceList;
              current.LDisRate1 = 0;
              current.Content = this.productDetails.ProductAtt08Desc ? this.productDetails.ProductAtt08Desc : '';
              current.ColorCode = res.ColorCode;
              current.ItemDim1Code = res.ItemDim1Code;
              current.Qty1 = parseInt(item.SelectedQuantity);
              current.MaxQty = item.MaxQuantity;
              current.BarcodeType = res.BarcodeType;

              console.log('current', current)
              this.pushProduct(current);

              this.dismiss();
              this.envService.dismissLoading();
            }).catch(error => this.envService.handleError(error));
          }).catch(error => this.envService.handleError(error));
        }
      }
      this.translateService.get('SELECT-PRODUCT_PRODUCTS_ADDED_TO_BASKET_SUCCESSFULLY_MESSAGE_TEXT').subscribe((value: string) => {
        this.envService.presentToast(value);
      });
    }
  }

  addProductwithItemCode() {
    this.envService.presentLoading();


    console.log("SalesTypeCodee2", this.PriceTypeCodee);
    console.log("sales Type", this.serverService.Settings.V3Settings.SalesType);
    this.getBarcodeData.Parameters[0].Value = this.product.ItemCode;
    this.getBarcodeData.Parameters[1].Value = this.color ? this.color : '';
    this.getBarcodeData.Parameters[2].Value = this.selectedSize ? this.selectedSize : '';
    this.serverService.getAny(this.getBarcodeData).then(res => {
      console.log("getbardocedata",res);
      console.log("barcodee",res[0].Barcode);
      this.product.UsedBarcode = res.Barcode ? res.Barcode : '';
      console.log("product detail withItemCode", this.productDetails);
      this.product.MesureCodeDesc1 = res.MesureCodeDesc ? res.MesureCodeDesc : '';
      this.product.Content = this.productDetails.ProductAtt08Desc ? this.productDetails.ProductAtt08Desc : '';

      this.barcodeData.Parameters[0].Value = res[0].Barcode;
      console.log("product detail PriceGroupCode", this.PriceTypeCodee);
      console.log("crntsales ",this.serverService.Settings.V3Settings.SalesType);

      this.barcodeData.Parameters[1].Value = this.PriceTypeCodee;
      this.serverService.getProductPrice(this.barcodeData).then(res => {
        console.log("Resss1321ss", res);
        if (res != null) {
          this.product.PriceList = res.PriceList ;
          this.product.MesureCode = this.productDetails.MesureCode;
          this.product.LDisRate1 = 0;
          this.product.ColorCode = res.ColorCode;
          this.product.ItemDim1Code = res.ItemDim1Code;
          this.product.Qty1 = parseInt(this.selectedQuantityP);
          this.product.BarcodeType = res.BarcodeType;
         
          this.product.UsedBarcode=res.Barcode;

          console.log("this.product = ",this.product);
          this.pushProduct(this.product);
          this.envService.dismissLoading();
          this.dismiss();
        } else {
          console.log("Seçmiş olduğunuz satış tipi için bu ürüne ait fiyat tanımlaması yapılmamış.");
          this.envService.presentAlert("Hata","Seçmiş olduğunuz satış tipi için bu ürüne ait fiyat tanımlaması yapılmamış.");
          this.envService.dismissLoading();
          this.dismiss();
        }

      }).catch(error => this.envService.handleError(error));
    }).catch(error => this.envService.handleError(error));
  }

  pushProduct(current: Product) {
    for (let item of this.serverService.Items) {
      if (item.ItemCode == current.ItemCode && item.UsedBarcode == current.UsedBarcode) {
        item.Qty1 += Number(current.Qty1);
        return
      }
    }

    //Toptan Satis ise
    if (this.serverService.Settings.V3Settings.SalesType == 0) {
      current.Price = this.productDetails.SalePrice;
    }
    else {
      current.Price = this.productDetails.RetailSalePrice;
      current.UseSerialNumber = this.productDetails.UseSerialNumber;
    }
    this.serverService.Items.push(current);
  }

  increase() {
    var temp = parseInt(this.selectedQuantityP);
    temp++;
    this.selectedQuantityP = temp.toString();
  }

  decrease() {
    var temp = parseInt(this.selectedQuantityP);
    if (temp > 1) {
      temp--;
      this.selectedQuantityP = temp.toString();
    } else {

    }
  }

  alertQuantity(item) {
    if (item.SelectedQuantity > item.MaxQuantity) {
      this.translateService.get('QUANTITY_EXCEDED_TEXT').subscribe((value: string) => {
        this.envService.presentToast(value);
        console.log(value);
      });
    }
  }
}
