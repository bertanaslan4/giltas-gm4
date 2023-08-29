import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular'; 

@Component({
  selector: 'app-customer-extra-report-detail',
  templateUrl: './customer-extra-report-detail.page.html',
  styleUrls: ['./customer-extra-report-detail.page.scss'],
})
export class CustomerExtraReportDetailPage implements OnInit {

  extredetail: any;  
  type: any;  
  documentDate: any;
  paymentInfo: any;


  userPaymentInfo ={
    "ProcName": "G4_GetCustomerPaymentInformation",
    "Parameters": [{ "Name": "DocumentNo", "Value": "" }]
  }

  constructor(public navCtrl: NavController, public serverService: ServerService, public modalCtrl: ModalController,
    public alertCtrl: AlertController, public activatedRoute: ActivatedRoute, public router: Router) { 
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.extredetail = this.router.getCurrentNavigation().extras.state.extredetail;  
          this.type = this.router.getCurrentNavigation().extras.state.type;
          this.documentDate = this.serverService.convertDate(this.extredetail[0].DocumentDate)
          console.log(this.documentDate)
          console.log(this.type);
        } 
      });
 
    }
 
  ngOnInit() {   
    this.getPaymentInfo();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceDetailPage');
  }
  getPaymentInfo(){ 
    this.userPaymentInfo.Parameters[0].Value = this.extredetail[0].RefNumber; 
    this.serverService.getAny(this.userPaymentInfo)
      .then(res =>{
        this.paymentInfo = res;
        console.log(res)
      })
  } 
}
