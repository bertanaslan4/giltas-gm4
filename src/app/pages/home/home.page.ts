import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { EnvService } from 'src/app/services/env.service';
import { ServerService } from 'src/app/services/server.service';
import { TranslateConfigService } from '../../services/translate-config.service';
import { TranslateService } from "@ngx-translate/core";
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  selectedLanguage: string;

  constructor(
    public translateService: TranslateService,
    public envService: EnvService, public serverService: ServerService,
    public storage: Storage, private router: Router, public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    private translateConfigService: TranslateConfigService) {
    this.selectedLanguage = 'tr'; //this.translateConfigService.getDefaultLanguage();
    this.languageChanged();
    //this.serverService.Settings.V3Settings.SalesType = 0;
  }

  ngOnInit() {
    
    console.log('Home SalesType = ',this.serverService.Settings.V3Settings.SalesType);
  }

  logout() {
    this.serverService.disconnect().then((res: any) => {
      console.log(res);
      this.serverService.Settings.Token = null;
      this.storage.clear();
    }, (error) => console.log(error));
    this.router.navigate(['login'])
  }
  goToProductsPage() {
    this.navCtrl.navigateForward('tabs/products')
  }
  goToCustomersPage() {
    console.log("tabs/customers");
    this.navCtrl.navigateForward('tabs/customers');
  }
  goToProposalPage() {
    this.navCtrl.navigateForward('tabs/proposal');
  }
  goToReportsPage() {
    this.navCtrl.navigateForward('tabs/reports');
  }

  languageChanged() {
    console.log('languageChanged', this.selectedLanguage)
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  async personButtonFunction(event) {
    console.log('1321231231', event)

    let user = this.serverService.Settings.V3Settings.SalespersonName
    const actionSheet = await this.actionSheetController.create({
      header: user,
      buttons: [
        (this.selectedLanguage != 'en') ?
          {
            text: 'English',
            icon: 'flag',
            handler: () => {
              this.selectedLanguage = 'en';
              this.languageChanged();
            }
          } :
          {
            text: 'Türkçe',
            icon: 'flag',
            handler: () => {
              this.selectedLanguage = 'tr';
              this.languageChanged();
            }
          },
        {
          text: 'Çıkış',
          icon: 'log-out',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
