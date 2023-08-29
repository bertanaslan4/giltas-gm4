import { Component, OnInit ,AfterContentInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { Product } from 'src/app/models/models';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements AfterContentInit {

  pageRoute: any;
  navParams: any;
  productList: Array<Product>
  userData = {
    "ProcName": "G4_ProductListNEW",
    "Parameters": [
      { "Name": "ItemDescription", "Value": "" }, { "Name": "ItemCode", "Value": "" },
      { "Name": "AttributeCode", "Value": "" }, { "Name": "AttributeType", "Value": "" }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    public envService: EnvService, public serverService: ServerService,
    public navCtrl: NavController) {
   
    this.pageRoute = this.router.routerState.snapshot.url
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParams = this.router.getCurrentNavigation().extras.state;
        console.log(this.router.getCurrentNavigation().extras.state)
      }
    });
  }

  ngAfterContentInit() {
    this.envService.presentLoading();
    this.getProducts();
    console.log("prod list sales type",this.serverService.Settings.V3Settings.SalesType);
  }

  getProducts() {
    this.userData.Parameters[0].Value = this.navParams.ItemDescription ? this.navParams.ItemDescription : '';
    this.userData.Parameters[1].Value = this.navParams.ItemCode ? this.navParams.ItemCode : '';
    this.userData.Parameters[2].Value = this.navParams.AttributeCode ? this.navParams.AttributeCode : '';
    this.userData.Parameters[3].Value = this.navParams.AttributeTypeCode ? this.navParams.AttributeTypeCode : '';
    this.serverService.getProducts(this.userData)
      .then(res => {
        this.productList = res;
        console.log(this.productList)
        this.envService.dismissLoading();
      })
      .catch(this.envService.handleError);
  }

  goToProducDetailPage(Params) {
    let navigationExtras: NavigationExtras = {
      state: {
        product: Params
      }
    };
    if (this.pageRoute == '/tabs/reports/product-filter/product-list') {
      this.navCtrl.navigateForward(`${this.pageRoute}/product-warehouse`, navigationExtras);
    } else if(
      this.pageRoute == '/tabs/proposal/products/product-filter/product-list' ||
      this.pageRoute == '/tabs/proposal/products/product-groups/product-attributes/product-list' ||
      this.pageRoute == '/tabs/proposal/products/product-list'
    ) {
      this.navCtrl.navigateForward(`${this.pageRoute}/product-select-product`, navigationExtras);
    } else {
      this.navCtrl.navigateForward(`${this.pageRoute}/product-detail`, navigationExtras);
    }
  }

  loadData(event) { 
    setTimeout(() => {
      console.log('Done');  
      this.getProducts();
      event.target.complete();  
      event.target.disabled = true; 
    }, 5000);  
  }

}