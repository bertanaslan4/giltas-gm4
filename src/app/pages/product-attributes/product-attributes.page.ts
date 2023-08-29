import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.page.html',
  styleUrls: ['./product-attributes.page.scss'],
})

export class ProductAttributesPage implements OnInit {

  pageRoute: any;

  navParams: any;
  attributeList = [];
  searchInput: string = '';
  userData = {
    "ProcName": "",
    "Parameters": [
      { "Name": "Language", "Value": "TR" }, { "Name": "AttributeTypeCode", "Value": "" },
      { "Name": "AttributeDescription", "Value": "" }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    public serverService: ServerService, public envService: EnvService,
    public navCtrl: NavController) {

    this.pageRoute = this.router.routerState.snapshot.url
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParams = this.router.getCurrentNavigation().extras.state.parms;
      }
    });

  }
  ngOnInit() {
    this.envService.presentLoading();
    this.getProductAttributes('');
  }

  getProductAttributes(attdesc) {
    this.userData.ProcName = "G4_GetAttributes";
    this.userData.Parameters[1].Value = this.navParams;
    this.userData.Parameters[2].Value = attdesc;
    this.serverService.getAny(this.userData).then(res => {
      this.attributeList = res;
      this.envService.dismissLoading();
      console.log(this.navParams);
      console.log(res);
    }).catch(this.envService.handleError);
  }

  onInput(event: any) {
    if (event.detail) {
      console.log(event.detail.srcElement.value)
      this.getProductAttributes(event.detail.srcElement.value)
    } else {
      this.getProductAttributes('');
    }
  }

  goToProductListPage(att) {
    let navigationExtras: NavigationExtras = {
      state: {
        AttributeCode: att.AttributeCode,
        AttributeTypeCode: att.AttributeTypeCode
      }
    };

    this.navCtrl.navigateForward(`${this.pageRoute}/product-list`, navigationExtras);
  }

  loadData(event) { 
    setTimeout(() => {
      console.log('Done');  
      this.getProductAttributes('');
      event.target.complete();  
      event.target.disabled = true; 
    }, 1000);  
  }
}
