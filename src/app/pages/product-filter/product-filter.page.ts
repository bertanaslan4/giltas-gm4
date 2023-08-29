import { Component, OnInit } from '@angular/core'; 
import { NavController } from '@ionic/angular'; 
import { Router, NavigationExtras } from '@angular/router'; 

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.page.html',
  styleUrls: ['./product-filter.page.scss'],
})
export class ProductFilterPage implements OnInit { 


  pageRoute: any;
  ItemDescription: string;
  ItemCode: string;   

  constructor(public navCtrl: NavController, public router: Router) { 
      this.pageRoute = this.router.routerState.snapshot.url
    }

  ngOnInit() {
  }

  searchProduct(form) {
    let navigationExtras: NavigationExtras = {
      state: { 
        ItemDescription: form.value.ItemDescription,
        ItemCode: form.value.ItemCode
      }
    };
    this.navCtrl.navigateForward( `${this.pageRoute}/product-list`, navigationExtras);
  }
}
