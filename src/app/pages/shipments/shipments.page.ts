import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.page.html',
  styleUrls: ['./shipments.page.scss'],
})
export class ShipmentsPage implements OnInit {

  userData = {
    "ProcName": "G4_GetNotAcceptedShipments",
    "Parameters": [{ "Name": "StoreCode", "Value": "" }]
  };

  list: any;

  shipmentData = {
    "ModelType": 0,
    "Lines": []
  }

  line = {
    "ShipmentHeaderID": "",
  }
  constructor(public navCtrl: NavController, public serverService: ServerService, public alertCtrl: AlertController,
    public translateService: TranslateService, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public envService: EnvService, ) { }

  ngOnInit() {
    this.getShipments();
  }

  getShipments() {
    this.envService.presentLoading();
    this.userData.Parameters[0].Value = this.serverService.Settings.V3Settings.StoreCode;
    this.serverService.getAny(this.userData).then(res => {
      console.log(res);
      this.list = res;
      this.envService.dismissLoading();
    }).catch(this.handleError);
  }

  handleError(error: any) {
    this.envService.dismissLoading();
    console.error('An error occurred', error);
    this.translateService.get(['ALERT_ERROR_TITLE_TEXT', 'ALERT_ERROR_SERVER_CONNECTION_MESSAGE_TEXT']).subscribe((value: string[]) => {
      this.showAlert(value['ALERT_ERROR_TITLE_TEXT'], value['ALERT_ERROR_SERVER_CONNECTION_MESSAGE_TEXT'] + error);
    });
  }

  showAlert(title: string, subTitle: string) {
    this.translateService.get('ALERT_BUTTON_OK_TEXT').subscribe(async (value: string) => {
      let alert = await this.alertCtrl.create({
        header: title,
        subHeader: subTitle,
        buttons: [value]
      });
      alert.present();
    });
  }

  public async presentConfirmAlert(item) {
    let alert = await this.alertCtrl.create({
      header: 'Mal Kabul',
      subHeader: item.ItemCode + ' nolu ürün kodu, ' + item.FromStoreDescription + ' mağazasından transfer işlemi Onaylıyor musunuz?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
        },
        {
          text: 'Tamam',
          handler: () => {
            this.acceptShipment(item);
          }
        },
      ]
    });
    alert.present();
  }

  acceptShipment(item) {
    this.line.ShipmentHeaderID = item.ShipmentHeaderID;
    this.shipmentData.Lines.push(this.line);
    console.log(this.shipmentData);
    this.envService.presentLoading();

    this.serverService.approveTransfer(this.shipmentData).then(res => {
      this.envService.dismissLoading();
      console.log(res)
      if (res && res.ModelType == 0) {
        this.envService.presentToast('Mal kabul işlemi tamamlandi.');
      } else if (res && res.ModelType == 0) {
        this.envService.presentToast(res.ExceptionMessage);
      }
    }).catch(this.handleError);
  }


}
