import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { NavController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
})
export class CustomerListPage implements OnInit {

  navParams: any;
  pageRoute: any;
  myInput: string;
  scrollCount: number = 0;
  pagefetch: number = 0;
  pagefetchcount: number = 0;
  dataList: any[] = [];
  checklog: boolean = false;
  items: Array<Customer>;
  @ViewChild("IonInfiniteScroll", { static: true }) infiniteScroll: IonInfiniteScroll;

  cTypeCheck = false;

  userData = {
    "ProcName": "", "Parameters": [
      { "Name": "FirstName", "Value": "" },
      { "Name": "LastName", "Value": "" },
      { "Name": "FirstLastName", "Value": "" },
      { "Name": "Code", "Value": "" },
      { "Name": "IdentityNumber", "Value": "" },
      { "Name": "PhoneNumber", "Value": "" },
      { "Name": "FetchPage", "Value": "" }]
  };

  userDataFetch = {
    "ProcName": "", "Parameters": [
      { "Name": "FirstName", "Value": "" },
      { "Name": "LastName", "Value": "" },
      { "Name": "FirstLastName", "Value": "" },
      { "Name": "Code", "Value": "" },
      { "Name": "IdentityNumber", "Value": "" },
      { "Name": "PhoneNumber", "Value": "" },
      { "Name": "FetchPage", "Value": "" }]
  };



  constructor(
    public serverService: ServerService,
    public envService: EnvService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public navCtrl: NavController) {

    this.pageRoute = this.router.routerState.snapshot.url
    console.log(this.pageRoute)
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParams = this.router.getCurrentNavigation().extras.state.parms;
        console.log("CurrAcc_TypeCode", this.navParams.CurrAcc_TypeCode);
/*
        if (this.navParams.CurrAcc_TypeCode == "3") {
          this.serverService.Settings.V3Settings.SalesType = 0;
        } else if (this.navParams.CurrAcc_TypeCode == "4") {
          this.serverService.Settings.V3Settings.SalesType = 4;
        } */

        console.log("ddd", this.navParams);
      }
    });
  }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.envService.presentLoading();
    this.cTypeCheck = false;
    console.log('SalesType List page', this.serverService.Settings.V3Settings.SalesType);
    if (this.checklog == false) {
      if (this.serverService.Settings.V3Settings.SalesType == 0 || this.serverService.Settings.V3Settings.SalesType == 3) {  //Toptan Satış

        //const cType = { "Name": "CustomerType", "Value": "0, 3, 4" };  // Boş


        this.userData.ProcName = "G4_CustomerListWholePaging";
        //this.userData.Parameters.push(cType);
        this.userDataFetch.ProcName = "G4_CustomerListWholefetchCount";
        //this.userDataFetch.Parameters.push(cType);

      } else {
        this.userData.ProcName = "G4_CustomerListRetailPaging";
        this.userDataFetch.ProcName = "G4_CustomerListRetailfetchCount";
      }

      // if (this.serverService.Settings.V3Settings.SalesType == 1  ) {  //Toptan Satış
      //   this.userData.ProcName = "G4_CustomerListWholePaging";
      //   const cType = { "Name": "CustomerType", "Value": "0" };  // Boş
      //   this.userData.Parameters.push(cType);
      //   this.userDataFetch.ProcName = "G4_CustomerListWholefetchCount";
      //   this.userDataFetch.Parameters.push(cType);    
      // } else if (this.serverService.Settings.V3Settings.SalesType == 4) { //İhracat Satış
      //   this.userData.ProcName = "G4_CustomerListWholePaging";
      //   const cType = { "Name": "CustomerType", "Value": "3, 4" };  //Yurt Dışı Bayi  3 ve 4 olmalı
      //   this.userData.Parameters.push(cType);
      //   this.userDataFetch.ProcName = "G4_CustomerListWholefetchCount";
      //   this.userDataFetch.Parameters.push(cType);      
      // } else {
      //   this.userData.ProcName = "G4_CustomerListRetailPaging";
      //   this.userDataFetch.ProcName = "G4_CustomerListRetailfetchCount";
      // }

      // Bayi satış süreçleri eklenecek..!
      console.log("paramss", this.navParams);
      // this.userData.Parameters[0].Value = ''; // TODO JS4 name kontrol edilecek
      // this.userDataFetch.Parameters[0].Value = '';
      // this.userData.Parameters[1].Value = '';
      // this.userDataFetch.Parameters[1].Value = '';
      // this.userData.Parameters[2].Value = this.navParams.idno;
      // this.userDataFetch.Parameters[2].Value = this.navParams.idno;
      // this.userData.Parameters[3].Value = this.navParams.telno;
      // this.userDataFetch.Parameters[3].Value = this.navParams.telno;
      // this.userData.Parameters[4].Value = this.navParams.customercode;
      // this.userDataFetch.Parameters[4].Value = this.navParams.customercode;
      // this.userData.Parameters[5].Value = this.navParams.name_surname;
      // this.userDataFetch.Parameters[5].Value = this.navParams.name_surname;
      this.userData.Parameters[0].Value ='';
      this.userDataFetch.Parameters[0].Value = '';
      this.userData.Parameters[1].Value = '';
      this.userDataFetch.Parameters[1].Value = '';
      this.userData.Parameters[2].Value = this.navParams.name_surname;
      this.userDataFetch.Parameters[2].Value = this.navParams.name_surname;
      this.userData.Parameters[3].Value = this.navParams.customercode;
      this.userDataFetch.Parameters[3].Value = this.navParams.customercode;
      this.userData.Parameters[4].Value = this.navParams.idno;
      this.userDataFetch.Parameters[4].Value = this.navParams.idno;
      this.userData.Parameters[5].Value = this.navParams.telno;
      this.userDataFetch.Parameters[5].Value = this.navParams.telno;

      this.userData.Parameters[6].Value = this.scrollCount.toString();
      this.userDataFetch.Parameters[6].Value = this.scrollCount.toString();

      this.serverService.getCustomers(this.userData).then(res => {
        console.log('getCustomers length', res);
        if (res.length > 10) {
          for (let i = 0; i < 10; i++) {
            this.dataList.push(res[i]);
          }
        } else {
          for (let i = 0; i < res.length; i++) {
            this.dataList.push(res[i]);
          }
        }
        this.items = this.dataList //direk itemse push edemiyorum (hata veriyor)
        console.log(this.items)
      }).catch(this.envService.handleError);

      this.serverService.getCustomers(this.userDataFetch).then(res => {
        console.log("userDataFetch", res);
        //console.log("res Total", res[0]["Total"]);

        this.pagefetchcount = res[0]["Total"];
        console.log('pagefetchcount', this.pagefetchcount)
        this.envService.dismissLoading();
      }).catch(this.envService.handleError);
      console.log(this.dataList)
    }
  }

  goToCustomerDetailPageParams(Params: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        customer: Params,
        showImage: true
      }
    };
    if (this.pageRoute == '/tabs/proposal/customers/customer-list') {
      this.router.navigate(['tabs/proposal'], { queryParams: Params })
    } else if (this.pageRoute == '/tabs/reports/customers/customer-list' || this.pageRoute == '/tabs/customers/customer-list') {
      this.navCtrl.navigateForward(`${this.pageRoute}/customer-detail`, navigationExtras);
    }
    // else if(this.pageRoute == '/tabs/reports/customers/customer-list'){
    //   this.navCtrl.navigateForward(`${this.pageRoute}/customer-extra-report`, navigationExtras);
    // }
  }

  goToCustomerDetailPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        showImage: true
      }
    };
    if (this.pageRoute == '/tabs/proposal/customers/customer-list') {
      this.router.navigate(['tabs/proposal'])
    } else if (this.pageRoute == '/tabs/reports/customers/customer-list' || this.pageRoute == '/tabs/customers/customer-list') {
      this.navCtrl.navigateForward(`${this.pageRoute}/customer-detail`, navigationExtras);
    }
    // else if(this.pageRoute == '/tabs/reports/customers/customer-list'){
    //   this.navCtrl.navigateForward(`${this.pageRoute}/customer-extra-report`, navigationExtras);
    // }
  }
  loadData(event) {
    setTimeout(() => {
      this.scrollCount = this.scrollCount + 10;
      this.getCustomers();
      event.target.complete();
      if (this.pagefetchcount == this.scrollCount || this.pagefetchcount < this.scrollCount) {
        event.target.disabled = true;
      }

    }, 1000);
  }

}
