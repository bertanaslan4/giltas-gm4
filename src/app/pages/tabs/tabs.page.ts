import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private userData = { "ProcName": "G4_GetColors", "Parameters": [{ "Name": "Language", "Value": "TR" }] };
  ModuleLicense: string;

  constructor(public serverService: ServerService, public envService: EnvService) {
    this.ModuleLicense = this.serverService.Settings.G3License.Modules;

  }

  ngOnInit() {
    this.getColors();
    this.getOpenOrders();
    this.getNotAcceptedShipments();
   
  }

  getColors() {
    this.serverService.getAny(this.userData).then(res => {
      console.log('colors');
      console.log(res);
      this.serverService.Colors = res;
    }).catch(this.envService.handleError);
  }

  getOpenOrders() {
    this.userData.ProcName = "G4_GetOpenOrders";
    this.userData.Parameters[0].Name = "StoreCode";
    this.userData.Parameters[0].Value = this.serverService.Settings.V3Settings.StoreCode;
    this.serverService.getAny(this.userData).then(res => {
      console.log(res);
      if (Array.isArray(res)) this.serverService.openOrdersCount = res.length;
    }).catch(this.handleError);
  }

  getNotAcceptedShipments() {
    this.userData.ProcName = "G4_GetNotAcceptedShipments";
    this.userData.Parameters[0].Name = "StoreCode";
    this.userData.Parameters[0].Value = this.serverService.Settings.V3Settings.StoreCode;
    this.serverService.getAny(this.userData).then(res => {
      console.log(res);
      if (Array.isArray(res)) this.serverService.notAcceptedShipmentCount = res.length;
    }).catch(this.handleError);
  }

  handleError(error: any) {
    console.error('An error occurred', error);
  }
}
