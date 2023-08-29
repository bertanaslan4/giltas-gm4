import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { AlertController, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-attribute-type',
  templateUrl: './modal-attribute-type.page.html',
  styleUrls: ['./modal-attribute-type.page.scss'],
})
export class ModalAttributeTypePage implements OnInit {

  jobName: string;
  productcode: string;  
  productattributeCode: string;
  // loading: Loading;  
  attributeType17List = [];
  public myInput: string = '';

  constructor(private envService: EnvService, private serverService: ServerService,
              public alertCtrl: AlertController, public modalCtrl: ModalController, public navCtrl: NavController) {

               }

  ngOnInit() {
  }

  closeModal(){
    this.modalCtrl.dismiss({txtPN: this.jobName});
  }

  closeModalCancel(){
    this.modalCtrl.dismiss({result: false});
  }
  onInput(event: any) { 
    this.getAttributeType17();
    return this.attributeType17List;
  }

  onCancel(){ 
    console.log('cancel')
  }

  getAttributeType17(){
    this.envService.presentLoading();
    let addData = { "ProcName": "G4_GetAttributeType17", "Parameters": [{ "Name": "Parent", "Value": "" }, { "Name": "Code", "Value": "" }] }
    addData.Parameters[0].Value = this.myInput;
    addData.Parameters[1].Value = ""
    this.serverService.getAny(addData)
        .then(res => {
            this.attributeType17List = res;
            this.envService.dismissLoading();
            console.log('getAttributeType17',this.attributeType17List);
        })
}

goToCustomerPage(att: any) {
  this.modalCtrl.dismiss({
    txtAttCode17: att.AttributeCode,
    txtAttDesc17: att.AttributeDescription
  })
}


}
