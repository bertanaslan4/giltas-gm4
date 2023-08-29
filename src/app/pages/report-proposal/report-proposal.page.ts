import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { ModalReportProposalFilterPage } from 'src/app/pages/modal-report-proposal-filter/modal-report-proposal-filter.page'


@Component({
  selector: 'app-report-proposal',
  templateUrl: './report-proposal.page.html',
  styleUrls: ['./report-proposal.page.scss'],
})
export class ReportProposalPage implements OnInit {

  buttonClicked: boolean = false;
  nextPage: string;
  total: number = 0;
  public items: any;
  pageRoute: any;
  

  userData = {
    "ProcName": "", "Parameters": [{ "Name": "Count", "Value": "" },
    { "Name": "WhereStr", "Value": "" }]
  };
  userData1 = {
    "ProcName": "", "Parameters": [{ "Name": "Count", "Value": "" },
    { "Name": "CurrAccDescription", "Value": "" },
    { "Name": "OrderNumber", "Value": "" },
    { "Name": "StartDate", "Value": "" },
    { "Name": "EndDate", "Value": "" }]
  };

  constructor(public serverService: ServerService, public envService: EnvService, private activatedRoute: ActivatedRoute,
    private router: Router, public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.pageRoute = this.router.routerState.snapshot.url
    console.log(this.pageRoute)
  }

  ngOnInit() {
    this.doFilter();
  }



  async filterModal1() {
    let modal = await this.modalCtrl.create({
      component: ModalReportProposalFilterPage,
      componentProps: {
        'items': this.items,
      }
    });
    modal.onDidDismiss().then(data => {
      if (data) {
        if (data.data.startDate && data.data.endDate) {
          const whrStr: string = " and o.OrderDate between '" + data.data.startDate + "' and '" + data.data.endDate + "'";
          this.userData.Parameters[1].Value = whrStr;

        } else if (data.data.orderNumber) {
          const whrStr: string = " and o.OrderNumber LIKE '" + data.data.orderNumber + "%'";
          this.userData.Parameters[1].Value = whrStr;
        }
        else if (data.data.customerName) {
          const whrStr: string = " and cr.CurrAccDescription LIKE '" + data.data.customerName + "%'";
          this.userData.Parameters[1].Value = whrStr;
        }
      } else {

      }
      this.doFilter();
    });
    return await modal.present();
  }

  async filterModal() {
    let modal = await this.modalCtrl.create({
      component: ModalReportProposalFilterPage,
      componentProps: {
        'items': this.items,
      }
    });
    modal.onDidDismiss().then(data => {
      console.log("ddddd1",data);

      

      let startDate=""; 
      let endDate= "";
      if(this.serverService.convertIonic4Date(data.data.startDate) != "NaN-NaN-NaN"){
        startDate=this.serverService.convertIonic4Date(data.data.startDate);
      }
      if(this.serverService.convertIonic4Date(data.data.endDate) != "NaN-NaN-NaN") {
        endDate=this.serverService.convertIonic4Date(data.data.endDate);
      }
      
      if(data.data.orderNumber==undefined) data.data.orderNumber="";

      //this.serverService.convertIonic4Date(data.data.endDate);

      console.log("Start - End",startDate,endDate);

      if (data) {
        this.userData1.ProcName="G4_WholesaleRetailOrders1";
        this.userData1.Parameters[1].Value = data.data.customerName;
        this.userData1.Parameters[2].Value = data.data.orderNumber;
        this.userData1.Parameters[3].Value = startDate;
        this.userData1.Parameters[4].Value = endDate;
      } 
      this.doFilter();
    });
    return await modal.present();
  }

  doFilter() {
    var temp = this.serverService.Settings.V3Settings.SalesType;
    this.envService.presentLoading();
    console.log("temp 1",temp);
    if (temp == 1 || temp == 4) {
      this.userData.ProcName = "G4_WholesaleOrders";
      this.serverService.getAny(this.userData).then(res => {
        this.items = res;
        console.log(res);
        if (Array.isArray(res)) this.items = res;
        else this.items = [];
        this.envService.dismissLoading();
        }).catch(this.envService.handleError);

    }else if (temp == 3 || temp == 5 || temp == 6) {
      this.userData1.ProcName = "G4_WholesaleRetailOrders1";
      console.log("userData1", this.userData1);
      const count: number = this.serverService.Settings.G3Settings.OrderCount ? this.serverService.Settings.G3Settings.OrderCount : 10;
      this.userData1.Parameters[0].Value = count.toString();
    
      this.serverService.getAny(this.userData1).then(res => {
      this.items = res;
      console.log(res);
      if (Array.isArray(res)) this.items = res;
      else this.items = [];
      this.envService.dismissLoading();
      }).catch(this.envService.handleError);
    }
  }


  async filterReport() {
    this.userData.Parameters[1].Value = '';
    let prompt = await this.alertCtrl.create({
      message: 'alertCustomCss',
      header: 'FİLTRELE',
      inputs: [
        {
          name: 'customer_name',
          placeholder: 'Müşteri Adı',
          type: 'text'
        },
        {
          name: 'order_number',
          placeholder: 'Sipariş Numarası',
        },
        {
          name: 'start_date',
          type: 'date'
        },
        {
          name: 'end_date',
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Sonuçları Getir',
          handler: data => {
            console.log(data);
            if (data.order_number == "" && data.start_date != "") {
              //const whrStr: string = " and ordernumber between '" + data.order_number + "' and '" + data.order_number + "'";                         
              const whrStr: string = " and orderdate between '" + data.start_date + "' and '" + data.end_date + "'";
              this.userData.Parameters[1].Value = whrStr;

            } else if (data.order_number == "" && data.start_date != "") {

            }
            this.doFilter();
          }
        },
        {
          text: 'İptal',
          handler: data => {

          }
        },
      ]
    });
    prompt.present();
  }

  onButtonClick() {
    this.buttonClicked = !this.buttonClicked;
  }

  selectOrder(number) {
    this.modalCtrl.dismiss(number);
  }

  /*
  goTo(order: any){    
     switch (this.nextPage) { 
       case 'report-proposal':
        this.selectOrder(order.OrderNumber);
        break;
        case 'report-proposal-detail':
        this.goToReportProposalDetails(order.OrderNumber);
        break;
    }
   }
   */
  refreshFilter() {
    this.userData.Parameters[1].Value = "";
    this.doFilter();
  }

  goToReportProposalDetails(number) {
    let navigationExtras: NavigationExtras = {
      state: {
        OrderNumber: number
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/report-proposal-detail`, navigationExtras);
  }
}

