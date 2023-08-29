import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { TranslateService } from "@ngx-translate/core";
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.page.html',
  styleUrls: ['./product-groups.page.scss'],
})
export class ProductGroupsPage implements OnInit {

  pageRoute: any;
  groupList = [];
  userData = { "ProcName": "", "Parameters": [{ "Name": "Language", "Value": "TR" }, { "Name": "AttributeTypeDescription", "Value": "" }] };


  constructor(private navCtrl: NavController, public serverService: ServerService,
    public translateService: TranslateService, public envService: EnvService,
    private activatedRoute: ActivatedRoute, public router: Router) {
    this.pageRoute = this.router.routerState.snapshot.url;
  }

  ngOnInit() {
    this.envService.presentLoading();
    this.getAttributeTypes('');
  }

  goToAttributePage(Params) {
    let navigationExtras: NavigationExtras = {
      state: {
        parms: Params
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/product-attributes`, navigationExtras);
  }

  onInput(event: any) {
    if (event.detail) {
      console.log(event.detail.srcElement.value)
      this.getAttributeTypes(event.detail.srcElement.value)
    } else {
      this.getAttributeTypes('');
    }
  }

  getAttributeTypes(value) {
    this.userData.ProcName = "G4_GetAttributeTypes";
    this.userData.Parameters[1].Value = value;
    this.serverService.getAny(this.userData).then(res => {
      this.groupList = res;
      console.log(res)
      this.envService.dismissLoading();
    }).catch(this.envService.handleError);
  }
}
