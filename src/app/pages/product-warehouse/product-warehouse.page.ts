import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service'
import { EnvService } from 'src/app/services/env.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-warehouse',
  templateUrl: './product-warehouse.page.html',
  styleUrls: ['./product-warehouse.page.scss'],
})
export class ProductWarehousePage implements OnInit {

  pageRoute: any;

  productColorSizeMatrix: any[] = [];
  ProductWarehouse: any[] = [];
  productPrices: any[] = [];
  PaymentPlanDescriptions: any[] = [];
  qty: any[] = new Array();
  tempItemDim: any[] = [];

  color: any;
  size: any;
  realqty: any;
  colHeaders: any;
  product: any;

  storeData = {
    "ProcName": "", "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "StoreCode", "Value": "" },
    { "Name": "WarehouseCode", "Value": "" }]
  };

  // getAvailableInventoryV3 = {   27.03.2020 de pasif edilmiştir.
  //   "ProcName": "G4_GetItemWarehouseInventory", "Parameters": [{ "Name": "ItemCode", "Value": "" },
  //   { "Name": "ColorCode", "Value": "" }]
  // };

  getAvailableInventoryV3 = {
    "ProcName": "G4_GetItemWarehouseInventory", "Parameters": [{ "Name": "ItemCode", "Value": "" }, { "Name": "Barcode", "Value": "" },
    { "Name": "ColorCode", "Value": "" }, { "Name": "WarehouseCode", "Value": "" }]
  };

  constructor(public serverService: ServerService, private router: Router, public envService: EnvService) {
    this.pageRoute = this.router.routerState.snapshot.url;
    if (this.pageRoute != '/tabs/reports/product-filter/product-list/product-warehouse') {
      this.product = this.router.getCurrentNavigation().extras.state.product;
      this.productPrices = this.router.getCurrentNavigation().extras.state.productPrices;
      this.productColorSizeMatrix = this.router.getCurrentNavigation().extras.state.productColorSizeMatrix;
      this.colHeaders = this.router.getCurrentNavigation().extras.state.colHeaders;
      this.PaymentPlanDescriptions = this.router.getCurrentNavigation().extras.state.PaymentPlanDescriptions;
      this.color = this.router.getCurrentNavigation().extras.state.ColorCode ? this.router.getCurrentNavigation().extras.state.ColorCode : '';
      this.size = this.router.getCurrentNavigation().extras.state.ItemDim1Code ? this.router.getCurrentNavigation().extras.state.ItemDim1Code : '';
    } else {
      this.product = this.router.getCurrentNavigation().extras.state.product;
    }
    console.log(this.router.getCurrentNavigation().extras.state)
  }

  ngOnInit() {
    this.envService.presentLoading();
    //this.getProductWareHouse(); 27.03.2020 de pasif edilmiştir. Tedbir amaçlı fonksiyon silinmemiştir.
    this.getProductWareHouseNew();
  }

  //TODO JS4 get it from settings
  /* getPriceGroup(item: string) {
      var tempPriceGroupCode: string;
      if (item.charAt(0) == "€") {
        tempPriceGroupCode = '€'
        return tempPriceGroupCode;
      } else if (item.charAt(0) == "$") {
        tempPriceGroupCode = '$'
        return tempPriceGroupCode;
      } else {
        tempPriceGroupCode = '₺'
        return tempPriceGroupCode;
      }
    } */

  getProductWareHouseNew() {
    console.log("product", this.product);
    this.getAvailableInventoryV3.Parameters[0].Value = this.product.ItemCode;
    this.getAvailableInventoryV3.Parameters[1].Value = this.product.Barcode ? this.product.Barcode : "";
    this.getAvailableInventoryV3.Parameters[2].Value = this.product.ColorCode ? this.product.ColorCode : "";
    this.serverService.getAny(this.getAvailableInventoryV3).then(res => {
      console.log('G4_GetItemWarehouseInventory', this.getAvailableInventoryV3);
      console.log(res);
      this.ProductWarehouse = res;
      this.envService.dismissLoading();
    }).catch(error => this.envService.handleError(error));
  }



  getProductWareHouse() {
    console.log("UseInventoryInProductDetail", this.serverService.Settings.G3Settings.UseInventoryInProductDetail);
    if (!this.serverService.Settings.G3Settings.UseInventoryInProductDetail) {
      this.storeData.ProcName = "G4_GetProductWarehouse";
      this.storeData.Parameters[0].Value = this.product.ItemCode;
      this.storeData.Parameters[1].Value = (this.serverService.Settings.V3Settings.OfficeCode) ? this.serverService.Settings.V3Settings.OfficeCode : "";
      this.storeData.Parameters[2].Value = (this.serverService.Settings.V3Settings.WarehouseCode) ? this.serverService.Settings.V3Settings.WarehouseCode : "";
      this.serverService.getAny(this.storeData).then(res => {
        console.log('G4_GetProductWarehouse');
        console.log(res);
        this.ProductWarehouse = res;
        // this.qty = this.ProductWarehouse.filter(x => x.ColorCode == this.color && x.ItemDim1Code == this.size);
        // this.realqty = this.qty[0]['Inventory'];
        // console.log(this.qty[0]['Inventory']);
        this.envService.dismissLoading();

      }).catch(error => this.envService.handleError(error));
    } else {
      for (let i = 0; i < this.productColorSizeMatrix.length; i++) {
        this.tempItemDim = [];
        this.getAvailableInventoryV3.Parameters[0].Value = this.product.ItemCode;
        this.getAvailableInventoryV3.Parameters[1].Value = this.productColorSizeMatrix[i]['R/B'];
        console.log('getAvailableInventory');
        this.serverService.getAny(this.getAvailableInventoryV3).then(res => {
          console.log('getAvailableInventory', res);
          this.tempItemDim = res;
          if (this.size != '' && this.color != '') {
            if (this.tempItemDim[0]['ColorCode'] == this.color && this.tempItemDim[0]['ItemDim1Code'] == this.size) {
              this.realqty = this.tempItemDim[0]['AvailableInventoryQty1'];
            }
          }
          for (let k = 0; k < this.tempItemDim.length; k++) {
            this.productColorSizeMatrix[i][this.tempItemDim[k]['ItemDim1Code']] = this.tempItemDim[k]['AvailableInventoryQty1'];
          }
          this.envService.dismissLoading();
        }).catch(error => this.envService.handleError(error));
      }
      console.log(this.realqty);
    }
  }

  getData(dim1: any, item: any) {
    if (dim1.ItemDim1Code == 'R/B') {
      const color = this.serverService.getColorDescription(item[dim1.ItemDim1Code]);
      return color;
    } else {
      const value = item[dim1.ItemDim1Code];
      return value;
    }
  }
}
