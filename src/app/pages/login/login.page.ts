//28022020
import { Component, OnInit } from '@angular/core';
import { Settings } from '../../models/models';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  success: string = 'Connection Created Successfully';
  account: { username: string, password: string } = {
    username: '',
    password: ''
  };

  constructor(public router: Router, public alertCtrl: AlertController,
    public serverService: ServerService, public storage: Storage,
    public envService: EnvService) {
  }

  ngOnInit() {
  }
  public async get(settingName) {
    return await this.storage.get(`setting:${settingName}`);
  }
  public clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  Login(form: NgForm) {
    //console.log("Sales Type : ", this.serverService.Settings.V3Settings.SalesType);
    this.clear();
    console.log('Login With Giltaş');
    this.envService.presentLoading();
    this.account.username = form.value.username;
    this.account.password = form.value.password;
    console.log('serverService.Settings', this.serverService.Settings);
    this.serverService.login(this.account).then((res: any) => {
      console.log("res", res);
      if (res.success) {
        console.log('res.Settings', res.Settings);


        this.serverService.Settings = (res.Settings);
        //TODO JS4 altaki kod kontrol edilmedli
        console.log('personel data', res);
        console.log('V3Settings', this.serverService.Settings.V3Settings);
        this.serverService.Settings.V3Settings.SalespersonName = res['personel']['name'];
        this.serverService.Settings.V3Settings.SalespersonNameCode = res['personel']['username'];
        this.serverService.Settings.V3Settings.SalespersonPassword = res['personel']['password'];
        this.serverService.Settings.V3Settings.SalespersonEmail = res['personel']['email'];
        this.serverService.Settings.FetchDate = new Date().getTime() / 1000;

        this.serverService.connect(this.serverService.Settings.Integrator.Url, this.serverService.Settings.Integrator).then((res: any) => {
          console.log('serverConnect', res);
          this.envService.dismissLoading();
          if (res.Status == this.success) {
            console.log('successsss');
            console.log('settings', this.storage);
            this.storage.set('settings', this.serverService.Settings);
            this.storage.set('settingsDate', new Date());
            this.router.navigate(['/tabs/home']);
          }
          else {
            this.envService.dismissLoading();
            this.envService.presentAlert('ALERT_ERROR_TITLE_TEXT', 'LOGIN_ALERT_ERROR_MESSAGE_INVALID_INTEGRATOR_USERNAME_OR_PASSWORD');
          }
        }, (error) => {
          this.envService.dismissLoading();
          this.envService.presentAlert('ALERT_ERROR_TITLE_TEXT', 'LOGIN_ALERT_ERROR_MESSAGE_CHECK_INTEGRATOR_CONNECTION_INFORMATIONS');
        })
      }
      else {
        this.envService.dismissLoading();
        this.envService.presentAlert('error', res.error);
      }
      // BK Continue convert josn
    }, (error) => {
      console.log(error);
      //this.dismissLoading();
    });
  }

  checkExpiryDate(expiryDate: string) {

    let now: Date = new Date();
    console.log('now: ' + now);

    let ds: string = atob(expiryDate);
    let exDate: Date = new Date(Number(ds) * 1000);
    console.log('expiryDate: ' + exDate);
    if (now > exDate)
      return false;
    else
      return true;

  }



}
