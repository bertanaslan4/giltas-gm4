import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController} from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';

@Component({
  selector: 'app-report-proposal-detail',
  templateUrl: './report-proposal-detail.page.html',
  styleUrls: ['./report-proposal-detail.page.scss'],
})
export class ReportProposalDetailPage implements OnInit {
 
  pageRoute: any;
  orderNumber: any;
  details: any;
  total: number = 0;
  buttonClicked: boolean = false; 
  userData = { "ProcName": "", "Parameters": [{ "Name": "OrderNumber", "Value": "" }] }; 

  constructor(public serverService: ServerService, public envService: EnvService,private activatedRoute: ActivatedRoute, 
    private router: Router, public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController) {  
      this.pageRoute = this.router.routerState.snapshot.url
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.orderNumber = this.router.getCurrentNavigation().extras.state.OrderNumber;
          console.log(this.orderNumber)
        }
      });  
    }

    onButtonClick() {
      this.buttonClicked = !this.buttonClicked;
    }

  ngOnInit() {   
    this.getReportProposalDetail();
  } 

  getReportProposalDetail(){
    this.envService.presentLoading(); 
    this.userData.ProcName = "G4_GetOrderDetails";
    this.userData.Parameters[0].Value = this.orderNumber;
    this.serverService.getAny(this.userData)
      .then(res => { 
        this.details = res;
        this.calculateTotal();
        this.envService.dismissLoading();
      })
      .catch(this.envService.handleError);
  }

  calculateTotal() {
    for (let item of this.details) {
      if(this.serverService.Settings.G3Settings.UseCustomPrice){
        var tempprice = item.Doc_Price - (item.LDisRate1*item.Doc_Price/100);        
        this.total = Number((this.total + item.Qty1 * tempprice).toFixed(2));
      }else{
        this.total = Number((this.total + item.Doc_Amount).toFixed(2));
      }
    }
    console.log(this.total);
  }
 
}
