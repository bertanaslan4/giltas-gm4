import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-customer-installment-detail',
  templateUrl: './customer-installment-detail.page.html',
  styleUrls: ['./customer-installment-detail.page.scss'],
})
export class CustomerInstallmentDetailPage implements OnInit {


  installments: any; 

  constructor(public serverService: ServerService, public navCtrl: NavController,
    public activatedRoute: ActivatedRoute, public router: Router){
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.installments = this.router.getCurrentNavigation().extras.state.installments;  
        console.log(this.installments)
      } 
    });
   }

  ngOnInit() {
  }

}
