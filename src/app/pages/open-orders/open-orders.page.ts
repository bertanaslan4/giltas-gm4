import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { ServerService } from 'src/app/services/server.service';
import { NavController, NavParams, AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit, KeyValueDiffers } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.page.html',
  styleUrls: ['./open-orders.page.scss'],
})
export class OpenOrdersPage implements OnInit {
  pageRoute: any;
  userData = {
    "ProcName": "G4_GetOpenOrders",
    "Parameters": [{ "Name": "StoreCode", "Value": "" }]
  };
  list: any;

  transferData = {
    "ModelType": 59,
    "CompanyCode": "1",
    "IsCompleted": true,
    "IsLocked": false,
    "IsReturn": false,
    "IsOrderBase": true,
    "IsTransferApproved": false,
    "ShippingPostalAddressID": "",
    "OfficeCode": "M02",
    "StoreCode": "M02",
    "WarehouseCode": "M02",
    "ToStoreCode": "M01",
    "ToWarehouseCode": "M01",
    "Series": "A",
    "SeriesNumber": 99999,
    "Description": "GM Üzerinden Onaylama",
    "StoreTransferType": 0,
    "Lines": []
  }

  line = {
    "OrderLineID": "",
    "UsedBarcode": "",
    "Qty1": "1"
  }

  constructor(public navCtrl: NavController, public serverService: ServerService, public alertCtrl: AlertController,
    public translateService: TranslateService, public toastCtrl: ToastController,
    public envService: EnvService, private router: Router) {
    this.pageRoute = this.router.routerState.snapshot.url;
  }

  ngOnInit() {
    this.getOpenOrders()
  }

  getOpenOrders() {
    this.envService.presentLoading();

    this.userData.Parameters[0].Value = this.serverService.Settings.V3Settings.StoreCode;
    this.serverService.getAny(this.userData).then(res => {
      console.log(res);
      this.list = res;
      if (Array.isArray(res)) this.serverService.openOrdersCount = res.length;
      this.envService.dismissLoading();
    }).catch(this.handleError);
  }

  handleError(error: any) {
    this.envService.dismissLoading();
    console.error('An error occurred', error);
    this.translateService.get(['ALERT_ERROR_TITLE_TEXT', 'ALERT_ERROR_SERVER_CONNECTION_MESSAGE_TEXT']).subscribe((value: string[]) => {
      this.envService.presentAlert(value['ALERT_ERROR_TITLE_TEXT'], value['ALERT_ERROR_SERVER_CONNECTION_MESSAGE_TEXT'] + error);
    });
  }

  // ALERT_BUTTON_OK_TEXT

  async presentConfirmAlert(item: any) {
    let alert = this.alertCtrl.create({
      header: 'Ürün Transferi',
      subHeader: item.ItemCode + ' nolu ürün kodu, ' + item.ToStoreCode + ' mağazasına transfer işlemi Onaylıyor musunuz?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
        },
        {
          text: 'Tamam',
          handler: () => {
            this.acceptTransfer(item);
          }
        },
      ]
    });
    (await alert).present();
  }

  acceptTransfer(item) {
    this.line.OrderLineID = item.OrderLineID;
    this.line.UsedBarcode = item.Barcode;

    //this.transferData.OfficeCode = item.OfficeCode;
    //this.transferData.StoreCode = item.StoreCode;
    //this.transferData.WarehouseCode = item.WarehouseCode;

    this.transferData.ToStoreCode = item.ToStoreCode;
    this.transferData.ToWarehouseCode = item.ToWarehouseCode;
    this.transferData.ShippingPostalAddressID = item.PostalAddressID;

    this.transferData.Lines = [];
    this.transferData.Lines.push(this.line);
    console.log(this.transferData);
    this.envService.presentLoading();

    this.serverService.postData(this.transferData).then(res => {
      this.envService.dismissLoading();
      console.log(res)
      if (res && res.ModelType == 59) {
        this.envService.presentToast('Transfer talep işlemi onaylandi.');
        this.getOpenOrders();
      } else if (res && res.ModelType == 0) {
        this.envService.presentToast(res.ExceptionMessage);
      }
    }).catch(this.handleError);
  }

}
