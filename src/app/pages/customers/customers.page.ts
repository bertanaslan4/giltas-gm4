import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Route } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';  

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  checkDatabase: number;
  pageRoute: any;
  index: number = 0;
  CurrAccTypeDescription : string; 
  CurrAccTypeCode:number = 0;
  //CurrAccTypeList:[];
  y:any;
  
  CurrAccType11={
    CurrAccTypeCode:0
  }

  CurrAccTypeList:any[] =[
     {
      CurrAccTypeCode: "3",
      CurrAccTypeDescription : "Toptan Müşteri"
     },
     {
      CurrAccTypeCode: "4",
      CurrAccTypeDescription : "Perakende Müşteri"
     }
    ];

  constructor(private navCtrl: NavController, public serverService: ServerService,
    public envService: EnvService, private route: ActivatedRoute,
    public router: Router, public modalCtrl: ModalController) {
    this.pageRoute = this.router.routerState.snapshot.url;
    console.log(this.pageRoute);
    this.getCurrAccTypeDesc(this.serverService.Settings.V3Settings.SalesType);
  }

  CurrAccTypeData = { "ProcName": "G4_GetCurrAccTypeDesc", "Parameters": [{ "Name": "Language", "Value": "TR" }] };

  ngOnInit() { 

    // this.y=this.route.snapshot.paramMap.get('pageid');
    // console.log("yyyy" , this.y); 
    console.log("CurrAccTypeList",this.CurrAccTypeList); 
    console.log('SalesType = ',this.serverService.Settings.V3Settings.SalesType);


    //this.serverService.Settings.V3Settings.SalesType = 0;
    //console.log('SalesType = ',this.serverService.Settings.V3Settings.SalesType);
    
    //this.getCurrAccTypeDesc(this.serverService.Settings.V3Settings.SalesType);
  }
  getCurrAccTypeDesc(SalesType:any){          
    console.log('Çalıştı',SalesType);
    if(SalesType == 0 || SalesType == 3){
     // this.CurrAccTypeDescription = "Toptan Müşteri";
     // this.CurrAccTypeCode=3
     // this.CurrAccTypeList[0].CurrAccTypeCode="3";
     // this.CurrAccTypeList[0].CurrAccTypeDescription="Toptan Müşteri"
     this.CurrAccType11.CurrAccTypeCode=this.CurrAccTypeList[0].CurrAccTypeCode; 


    }else if(SalesType == 1 || SalesType == 2 || SalesType == 4 || SalesType == 5){
     // this.CurrAccTypeDescription = "Perakende Müşteri";
     // this.CurrAccTypeCode = 4;
     // this.CurrAccTypeList[1].CurrAccTypeCode="4";
     // this.CurrAccTypeList[1].CurrAccTypeDescription="Perakende Müşteri";
     this.CurrAccType11.CurrAccTypeCode=this.CurrAccTypeList[1].CurrAccTypeCode; 
    }    
     return this.CurrAccType11.CurrAccTypeCode;
 }


  getCurrAccTypes() {
    this.CurrAccTypeData.ProcName="G4_GetCurrAccTypeDesc";
    this.serverService.getAny(this.CurrAccTypeData)
      .then(res => {
        this.envService.dismissLoading();
        this.CurrAccTypeList = res; 
        console.log('CurrAccTypeList1: ',this.CurrAccTypeList);
      }).catch(this.envService.handleError);
  }

  searchCustomers(form: NgForm) {
    let navigationExtras: NavigationExtras = {
      state: {
        parms: form.value
      }
    };
    console.log('form value : ',form.value); 
    //console.log('navigationExtras',navigationExtras);
    this.navCtrl.navigateForward(`${this.pageRoute}/customer-list`,navigationExtras);
  }
  addNewCustomer(){
    let navigationExtras: NavigationExtras 
    this.navCtrl.navigateForward(`${this.pageRoute}/customer-detail`,navigationExtras);
  }

}
