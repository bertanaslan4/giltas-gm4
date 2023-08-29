import { OpenOrdersPage } from './../open-orders/open-orders.page';
import { ServerService } from 'src/app/services/server.service';
import { NavController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  pageRoute:any;
  constructor(public navCtrl:NavController, public serverService:ServerService,private router:Router) { 
    this.pageRoute=this.router.routerState.snapshot.url;
  }

  ngOnInit() {
  }

  ionViewDidLoad(){
    console.log(this.serverService);
    console.log('ionViewDidLoad NotificationPage');
  }

  goToOpenOrders() {
    this.navCtrl.navigateForward('tabs/notifications/open-orders');
  }

  goToShipments(){
    this.navCtrl.navigateForward('tabs/notifications/shipments')
  }

}
