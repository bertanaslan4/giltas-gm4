import { Component, OnInit } from '@angular/core';
import { ModalController,NavController} from '@ionic/angular';  
import { ActivatedRoute, Router} from '@angular/router'; 

@Component({
  selector: 'app-modal-country',
  templateUrl: './modal-country.page.html',
  styleUrls: ['./modal-country.page.scss'],
})
export class ModalCountryPage implements OnInit {

  countryList = [];
  countryListTmp = [];
  public myInput: string = '';

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
              public activatedRoute: ActivatedRoute, public router: Router) { 
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.countryList = this.router.getCurrentNavigation().extras.state.customer; 
      }
    });

  }

  ngOnInit() {
  }

  onInput(event: any) {
    this.countryListTmp = this.countryList.filter( item => {return item.Description.toLowerCase().includes(this.myInput);});
    console.log("country list tmp",this.countryListTmp);
    return this.countryListTmp;
}

onCancel(){
    this.countryListTmp = this.countryList;
}

back() {
    this.modalCtrl.dismiss();
}

selectCountry(item: any){
    this.modalCtrl.dismiss(item);
}
}
