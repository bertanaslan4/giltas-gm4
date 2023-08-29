import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EnvService } from 'src/app/services/env.service';
import { ServerService } from 'src/app/services/server.service';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  pageRoute: any;
  getItemCodeData = { "ProcName": "G4_GetProductItemCode", "Parameters": [{ "Name": "Barcode", "Value": "" }] };

  constructor(public router: Router, private barcodeScanner: BarcodeScanner,
    public serverService: ServerService, public envService: EnvService,
    public navCtrl: NavController
  ) {

    this.pageRoute = this.router.routerState.snapshot.url;
  }

  ngOnInit() {
  }

  scanBarcode2() {
    var barcode = '3500000000033'; // 86933001';
    this.getItemCodeData.Parameters[0].Value = barcode;
    this.serverService.getAny(this.getItemCodeData).then(res => {
      console.log(res)
      if (res) {
        let navigationExtras: NavigationExtras = {
          state: {
            parms: res[0]
          }
        };
        this.navCtrl.navigateForward(`${this.pageRoute}/product-detail`, navigationExtras);
      }
      // this.navCtrl.push(ProductPage, { product: res[0], barcode: barcode });
    }).catch(this.envService.handleError);
  }

  scanBarcode() {
    this.serverService.isOpenCamera = true;
    console.log(this.serverService.isOpenCamera)
    this.barcodeScanner.scan().then((barcodeData) => {
      this.serverService.isOpenCamera = false;
      console.log(barcodeData.format)
      if (barcodeData.format == "EAN_8" || barcodeData.format == "EAN_13" || barcodeData.format == "CODE_128" || barcodeData.format == "UPC_A") {
        this.getItemCodeData.Parameters[0].Value = barcodeData.text;
        this.serverService.getAny(this.getItemCodeData).then(res => {
          if (res) {
            if (res.length > 0) {
              // this.navCtrl.push(ProductPage, { product: res[0], barcode: barcodeData.text });
            }
            else {
              this.envService.presentAlert('Hata', 'Ürün Bulunamadı');
            }
          }
        }).catch(this.envService.handleError);
      } else {
        this.envService.presentAlert("Geçersiz Barcode", "Lütfen Geçerli Formatta Barcode Okutunuz");
      }
    }, (err) => {
      console.log(err);
    });
  }


}
