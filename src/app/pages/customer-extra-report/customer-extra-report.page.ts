import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalFilterReportPage } from 'src/app//pages/modal-filter-report/modal-filter-report.page'
@Component({
  selector: 'app-customer-extra-report',
  templateUrl: './customer-extra-report.page.html',
  styleUrls: ['./customer-extra-report.page.scss'],
})
export class CustomerExtraReportPage implements OnInit {

  //loading: Loading;
  pageRoute: any;

  currAccCode: any;
  customerExtra: any[];
  tempLength: any[];
  length: number = 0;
  checkNetAmount: boolean = false;
  customerExtraResult: any[];

  balance_loc: number = 0;
  balance_doc: number = 0;
  total: number = 0;
  installmentTotal: number = 0;
  total_debit: number = 0;
  total_credit: number = 0;
  tempTotal: number = 0;
  buttonClicked: boolean = true;
  page = "0";
  tempNet: boolean = false;
  installments: any;
  installments_summary = [];


  userData = {
    "ProcName": "",
    "Parameters": [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "LangCode", "Value": "TR" }, { "Name": "Str1", "Value": "" },
    { "Name": "Str2", "Value": "" }]
  };

  userDataInstallment = {
    "ProcName": "",
    "Parameters": [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "LangCode", "Value": "TR" }]
  };

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public serverService: ServerService, public envService: EnvService, public activatedRoute: ActivatedRoute,
    public router: Router, public alertCtrl: AlertController, public toastCtrl: ToastController) {

    this.pageRoute = this.router.routerState.snapshot.url;
    console.log(this.pageRoute)
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.currAccCode = this.router.getCurrentNavigation().extras.state.currAccCode;
        console.log(this.router.getCurrentNavigation())
        this.customerExtraResult = [];
        this.customerExtra = [];
      }
    });
  }

  ionViewWillEnter() {
    this.reset();
    this.getExtras();
    this.getInstallments();
  }

  ngOnInit() {
  }


  getInstallments() {
    this.length = 0;
    this.userDataInstallment.ProcName = "G4_GetCustomerInstallments";
    this.userDataInstallment.Parameters[0].Value = this.currAccCode;
    this.serverService.getAny(this.userDataInstallment)
      .then(res => {
        console.log('installments');
        this.installments = res;
        this.tempLength = res;
        this.installments_summary = [];
        let debit: number = 0;
        let desc: string = '';
        let date: string = '';
        let temp: number = 0;
        for (let installement of this.installments) {
          this.length++;
          //console.log(installement.InstallmentAmount);
          if (date != installement.MonthYear) {
            //console.log(installement.MonthYear);                      
            if (debit > 0) {
              temp++;
              let installement_summary = {
                DueDate: this.getDateFixed(date),
                ApplicationDescription: desc,
                InstallmentAmount: debit.toFixed(2)
              };
              this.installments_summary.push(installement_summary);
              this.installmentTotal += debit;
              debit = parseFloat(installement.RemainingInstallment);
              desc = installement.ApplicationDescription;
              date = installement.MonthYear;
              if (this.length == this.tempLength.length) {
                let installement_summary = {
                  DueDate: this.getDateFixed(date),
                  ApplicationDescription: desc,
                  InstallmentAmount: debit.toFixed(2)
                };
                this.installments_summary.push(installement_summary);
                this.installmentTotal += debit;
              }
            }
            else {
              date = installement.MonthYear;
              desc = installement.ApplicationDescription;
              debit += parseFloat(installement.RemainingInstallment);
            }
          }
          else {
            debit += parseFloat(installement.RemainingInstallment);
          }
        }
        if (temp == 0 && date) {
          let installement_summary = {
            DueDate: this.getDateFixed(date),
            ApplicationDescription: desc,
            InstallmentAmount: debit.toFixed(2)
          };
          this.installments_summary.push(installement_summary);
          this.installmentTotal += debit;
        }
        this.installmentTotal = parseFloat(this.installmentTotal.toFixed(2));
        console.log(this.installmentTotal);
        console.log(this.installments);
        console.log(this.installments_summary);
      })
      .catch(this.envService.handleError);
  }


  goToOrderDetails(item: any) {
    this.tempNet = this.checkNetAmount;
    console.log(this.tempNet)
    let filtered_installments = []
    filtered_installments.push(item);
    let navigationExtras: NavigationExtras = {
      state: {
        extredetail: filtered_installments,
        type: this.tempNet
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/customer-extra-report-detail`, navigationExtras);
  }

  goToInstallmentDetails(item: any) {
    let filtered_installments = [];
    for (let installment of this.installments) {
      if (this.getDateFixed(installment.MonthYear) == item.DueDate) {
        filtered_installments.push(installment);
      }
    }
    let navigationExtras: NavigationExtras = {
      state: {
        installments: filtered_installments
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/customer-installment-detail`, navigationExtras);
    // modal = this.modalCtrl.create(InstallmentsDetailPage, {installments: filtered_installments});
    // modal.present();
    // modal.onDidDismiss(data => {
    //   console.log(data.result);
    // });    
  }

  getDateFixed(tempDate: string) {
    var txtsub = tempDate.substring(tempDate.length - 2, tempDate.length);
    var txtyyear = tempDate.substring(0, 4);
    var txtind: number;
    if (txtsub[0] == '0') {
      txtind = parseInt(txtsub[1]);
    } else {
      txtind = parseInt(txtsub);
    }
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
      'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return txtsub = monthNames[txtind - 1] + " " + txtyyear;
  }

  onButtonClick() {
    this.buttonClicked = !this.buttonClicked;
    /*if (this.buttonClicked == true) {
    document.getElementById('headerStyle').style.display = 'none';
    //document.getElementById('yns').style.textAlign = 'left';
    // (document.getElementsByClassName("textAlignSet") as HTMLCollectionOf<HTMLElement>)[0].style.textAlign = 'left';
  } else {
    document.getElementById('headerStyle').style.display = 'flex';
  }*/
  }

  reset() {
    this.balance_loc = 0;
    this.balance_doc = 0;
    this.total = 0;
    this.total_debit = 0;
    this.total_credit = 0;
    this.installmentTotal = 0;
    //this.tempTotal = 0;
  }

  async filterModal() {
    let modal = await this.modalCtrl.create({
      component: ModalFilterReportPage
    }
    );
    modal.onDidDismiss().then((data) => {
      if (data.data.result != false) {
        if (data.data.startDate && data.data.endDate) {
          this.userData.ProcName = "G4_GetCustomerExtraRetailSaleWithDate";
          this.userData.Parameters[2].Value = ((data.data.startDate + '').replace('-', '')).replace('-', '');
          this.userData.Parameters[3].Value = ((data.data.endDate + '').replace('-', '')).replace('-', '');
          console.log((data.data.minTotal) + " " + data.data.maxTotal);
        } else if (data.data.minTotal && data.data.maxTotal) {
          this.userData.ProcName = "G4_GetCustomerExtraRetailSaleWithtTotal";
          this.userData.Parameters[2].Value = data.data.startDate;
          this.userData.Parameters[3].Value = data.data.endDate;
          console.log((data.data.minTotal) + " " + data.data.maxTotal);
        }
        this.reset();
        this.getExtrasWithConditions();
      } else {
        this.refreshFilter();
      }

    });
    await modal.present();
  }

  async filterReport() {
    this.userData.Parameters[2].Value = '';
    let prompt = await this.alertCtrl.create({
      cssClass: 'alertCustomCss2',
      header: 'FİLTRELE',
      inputs: [
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
            const whrStr: string = " and orderdate between '" + data.start_date + "' and '" + data.end_date + "'";
            this.userData.Parameters[2].Value = whrStr;
            this.reset();
            this.getExtras();
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

  getExtrasWithConditions() {
    this.customerExtraResult = [];
    this.customerExtra = [];
    this.envService.presentLoading();
    this.userData.Parameters[0].Value = this.currAccCode;
    this.serverService.getAny(this.userData)
      .then(res => {
        if (this.envService) this.envService.dismissLoading();
        console.log(this.userData.ProcName);
        console.log(res);
        this.customerExtra = res;
        for (let i = 0; i < this.customerExtra.length; i++) {
          if (this.customerExtra[i]["NetAmount"] > 0) {
            this.customerExtraResult.push(this.customerExtra[i]);
          } else {

          }
        }
        this.setAcumulativeBalance();
      })
      .catch(this.envService.handleError);
    this.getInstallments();
  }


  getExtras() {
    var temp = this.serverService.Settings.V3Settings.SalesType;
    if (this.serverService.Settings.V3Settings.SalesType == 0
      || this.serverService.Settings.V3Settings.SalesType == 3) this.userData.ProcName = "G4_GetCustomerExtraWholeSale";
    else if (temp == 2) this.userData.ProcName = "G4_GetCustomerExtraRetailSale";
    else if (temp == 3) this.userData.ProcName = "G4_GetCustomerExtraRetailSale";
    else if (temp == 5) this.userData.ProcName = "G4_GetCustomerExtraRetailSale";
    this.envService.presentLoading();
    this.userData.Parameters[0].Value = this.currAccCode;
    this.serverService.getAny(this.userData)
      .then(res => {
        this.envService.dismissLoading();
        //console.log(this.userData.ProcName);                
        this.customerExtra = res;
        console.log('costumerExtra', this.customerExtra);
        if (this.customerExtra.length > 0) {
          if (this.customerExtra[0]["NetAmount"]) {
            for (let i = 0; i < this.customerExtra.length; i++) {
              if (this.customerExtra[i]["NetAmount"] > 0) {
                console.log(this.customerExtra[i]["NetAmount"]);
                this.tempTotal += this.customerExtra[i]["NetAmount"];
                this.customerExtraResult.push(this.customerExtra[i]);
              }
            }
          } else {
            this.checkNetAmount = true;
            for (let i = 0; i < this.customerExtra.length; i++) {
              if (this.customerExtra[i]["ItemCode"] != "" && this.customerExtra[i]["Doc_NetAmount"] > 0) {
                this.tempTotal += this.customerExtra[i]["Doc_NetAmount"];
                this.customerExtraResult.push(this.customerExtra[i]);
              }
            }
            console.log(this.customerExtraResult);
          }
          this.setAcumulativeBalance();
        }
      })
      .catch(this.envService.handleError);
  }

  refreshFilter() {
    this.tempTotal = 0;
    this.customerExtraResult = [];
    this.customerExtra = [];
    this.userData.Parameters[2].Value = "";
    this.userData.Parameters[3].Value = "";
    this.reset();
    this.getExtras();
    this.getInstallments();
  }

  setAcumulativeBalance() {
    for (let item of this.customerExtra) {
      this.balance_loc = Number((this.balance_loc + item.Loc_Balance).toFixed(2));
      item.Loc_BalanceAccumulative = this.balance_loc;

      this.balance_doc = Number((this.balance_doc + item.Doc_Balance).toFixed(2));
      item.Doc_BalanceAccumulative = this.balance_doc;
      //console.log('1',this.balance_loc);
      //console.log('2',this.balance_doc);


      if (this.serverService.Settings.V3Settings.IsExchange) {
        this.total = item.Doc_BalanceAccumulative;
        this.total_debit = Number((this.total_debit + item.Doc_Debit).toFixed(2));
        this.total_credit = Number((this.total_credit + item.Doc_Credit).toFixed(2));
        //console.log('3',this.total);
        //console.log('4',this.total_debit);
        //console.log('5',this.total_credit);

      } else {
        this.total = item.Loc_BalanceAccumulative;
        this.total_debit = Number((this.total_debit + item.Loc_Debit).toFixed(2));
        this.total_credit = Number((this.total_credit + item.Loc_Credit).toFixed(2));
        //console.log('6',this.total);
        //console.log('7',this.total_debit);
        //console.log('8',this.total_credit);
      }
    }
  }

}
