import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ModalController } from '@ionic/angular';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router'; 
import { ServerService } from 'src/app/services/server.service'; 
import { EnvService } from 'src/app/services/env.service'; 
import { ProposalPage } from './../proposal/proposal.page';
@Component({
  selector: 'app-proposal-type',
  templateUrl: './proposal-type.page.html',
  styleUrls: ['./proposal-type.page.scss'],
})
export class ProposalTypePage implements OnInit {

  changesaletype: string;
  SaleTypeLicense: string;
  SaleTypeLicense0: boolean;
  SaleTypeLicense1: boolean;
  SaleTypeLicense2: boolean;
  SaleTypeLicense3: boolean;
  SaleTypeLicense4: boolean;
  SaleTypeLicense5: boolean;
  text: string;

  constructor(public translateService: TranslateService, public navCtrl: NavController, public activatedRoute: ActivatedRoute,
              public serverService: ServerService,public envService: EnvService, public modalCtrl: ModalController) {  
                
                this.SaleTypeLicense = this.serverService.Settings.G3License.SalesTypes;
                console.log(this.changesaletype)

                if(this.SaleTypeLicense.charAt(0) != '0'){
                  this.SaleTypeLicense0 = true;
                }
                if(this.SaleTypeLicense.charAt(1) != '0'){
                  this.SaleTypeLicense1 = true;
                }
                if(this.SaleTypeLicense.charAt(2) != '0'){
                  this.SaleTypeLicense2 = true;
                }
                if(this.SaleTypeLicense.charAt(3) != '0'){
                  this.SaleTypeLicense3 = true;
                }
                if(this.SaleTypeLicense.charAt(4) != '0'){
                  this.SaleTypeLicense4 = true;
                }
                if(this.SaleTypeLicense.charAt(5) != '0'){
                  this.SaleTypeLicense5 = true;
                }

               }
               

  ngOnInit() {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProposalTypePage');
  }

  async goToProposalPage() {  
    console.log(this.changesaletype) 
    let modal = await this.modalCtrl.create({
      component: ProposalPage,
      componentProps: {
        type: this.changesaletype
      }
    });
    console.log(this.changesaletype)
    modal.present();
  }

  // closeModal(){
  //   this.modalCtrl.dismiss({type: false});
  // }

}
