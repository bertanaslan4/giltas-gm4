import { Storage } from '@ionic/storage';
import { ServerService } from './services/server.service';

import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public serverService: ServerService,
    public storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get('settings').then((val) => {
        console.log('settings', val);
        if (val) {          
          this.serverService.Settings = val;
          const nowTimeStamp = new Date().getTime() / 1000;
          if(nowTimeStamp - this.serverService.Settings.FetchDate < 6000){
            this.serverService.Settings.G3Settings.UseInventoryInProductDetail = true;
            this.serverService.Settings.G3Settings.SendReceiptViaMail = false;
            this.serverService.Settings.G3Settings.EnableMultipleView = true;
            this.serverService.Settings.G3Settings.ShowTotalInReports = false;
            this.serverService.Settings.G3Settings.UseCustomPrice = false;
            this.serverService.Settings.G3Settings.ShowPaymentPlans = false;
            this.serverService.Settings.G3Settings.ShowTaxPlans = false;

            this.serverService.Settings.G3Settings.UseColorSizeMatrix = true;
            this.serverService.Settings.G3Settings.AddOrderDiscount = true;
  
            this.navCtrl.navigateForward('/tabs/home');
          }else{
            // TODO logout yap + disconnect
            this.navCtrl.navigateForward('/login');  
          }
        } else {
          this.navCtrl.navigateForward('/login');
        }
      });
    });
  }

}
