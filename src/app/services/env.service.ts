import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { TranslateService } from "@ngx-translate/core";
import { ServerService } from "src/app/services/server.service";

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  isLoading = false;

  constructor(
    private toastController: ToastController, public alertCtrl: AlertController,
    public loadingController: LoadingController, public translateService: TranslateService,
    public actionSheetController: ActionSheetController, public serverService: ServerService) { }

  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'dark'
    });
    toast.present();
  }

  async presentAlert(title: string, subTitle: string) {
    const alert = await this.alertCtrl.create({
      subHeader: title,
      message: subTitle,
      buttons: ['Tamam']
    });
    await alert.present();
  }
  

  handleError(error: any) {
    this.dismissLoading();
    console.error('An error occurred', error);
    this.translateService.get(['ALERT_ERROR_TITLE_TEXT', 'ALERT_ERROR_SERVER_CONNECTION_MESSAGE_TEXT']).subscribe( async (value: string[]) => {
      await this.presentAlert(value['ALERT_ERROR_TITLE_TEXT'], value['ALERT_ERROR_SERVER_CONNECTION_MESSAGE_TEXT'] + error);
    });
  }

  async presentLoading() {
    if (this.isLoading == false) {
      this.isLoading = true;
      return await this.loadingController.create({
        duration: 5000,
        message: 'Lütfen Bekleyin...'
      }).then(a => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
    }
  }

  async dismissLoading() {
    //console.log("this.isLoading",this.isLoading);
    if (this.isLoading == true) {
      this.isLoading = false;
      return await this.loadingController.dismiss().then(() => console.log('dismissed'));
     
    }
  }
}