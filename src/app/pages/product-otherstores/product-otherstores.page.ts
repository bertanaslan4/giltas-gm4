import { Product } from 'src/app/models/models';
import { Component, OnInit } from '@angular/core'; 
import { NavController,NavParams, ToastController, AlertController} from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-otherstores',
  templateUrl: './product-otherstores.page.html',
  styleUrls: ['./product-otherstores.page.scss'],
})
export class ProductOtherstoresPage implements OnInit { 

  ItemCode: any;
  productOtherStore: any [] = [];
  transferData = {
    "ModelType": "18",
    "CompanyCode": 1, 
    "OfficeCode": "", 
    "StoreCode": "", 
    "WarehouseCode": "", 
    "ToStoreCode": this.serverService.Settings.V3Settings.StoreCode,
    "ToWarehouseCode": this.serverService.Settings.V3Settings.WarehouseCode,
    "InternalDescription": "GM Ürün Transfer Talebi", 
    "IsCompleted": true, "IsCreditableConfirmed": true, "IsCreditSale": true, 
    "StoreOrderRequestTypes": 1,
    "Lines": []
  }

  line = {
     "ItemTypeCode": 1, 
     "ItemCode": "",
     "ColorCode": "",
     "ItemDim1Code": "",
     "Qty1": "1",
     "UsedBarcode": ""
  }

  storeData = {"ProcName": "", "Parameters": [{"Name": "ItemCode", "Value": ""}]}; 

  constructor(public navCtrl: NavController,public serverService: ServerService, 
              public envService: EnvService , private router: Router, public toastCtrl: ToastController
              , public alertCtrl: AlertController) { 
                 
              this.ItemCode = this.router.getCurrentNavigation().extras.state.ItemCode;
              console.log(this.ItemCode)
              }

  ngOnInit() {
  this.envService.presentLoading();
  this.getProductOtherStores();
  }

   getProductOtherStores(){ 
    this.storeData.ProcName = "G4_GetAllProductWarehouse";  
    this.storeData.Parameters[0].Value = this.ItemCode;
    this.serverService.getAny(this.storeData).then(res =>{
        this.productOtherStore = res; 
        console.log(this.productOtherStore) 
        this.envService.dismissLoading();
     }).catch(error => this.envService.handleError(error));
   }
   transfer(item) {
    if (item.Inventory > 0 && item.Barcode != '') {
      this.line.UsedBarcode = item.Barcode;

      this.transferData.OfficeCode = item.OfficeCode;
      this.transferData.StoreCode = item.StoreCode;
      this.transferData.WarehouseCode = item.WarehouseCode;

      this.transferData.Lines.push(this.line);
      console.log(this.transferData);
      this.envService.presentLoading();
      this.serverService.postData(this.transferData).then(res => {
        this.envService.dismissLoading();
        console.log(res)
        if (res && res.ModelType == 18) {
          this.presentToast('Transfer talep işlemi gönderildi.');
        }else if (res && res.ModelType == 0) {
          this.presentToast(res.ExceptionMessage);
        }
      }).catch(this.envService.handleError);
    }
  }

  async presentToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'X'
    });
    toast.present();
  }

  public async presentAlert(item) {
    if (item.Inventory > 0 && item.Barcode != '') {
      let alert = await this.alertCtrl.create({
        header: 'Ürün Transferi',
        subHeader: item.Barcode + ' barkod nolu ürün ' + item.WarehouseDescription + ' dan transfer işlemi başlatılacak, Onaylıyor musunuz?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'İptal',
            role: 'cancel',
          },
          {
            text: 'Tamam',
            handler: () => {
              this.transfer(item);
            }
          },
        ]
      });
      alert.present();
    }
  }

}
