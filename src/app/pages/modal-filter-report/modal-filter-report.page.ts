import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-filter-report',
  templateUrl: './modal-filter-report.page.html',
  styleUrls: ['./modal-filter-report.page.scss'],
})
export class ModalFilterReportPage implements OnInit {

  startDate: string;  
  endDate: string;  
  minTotal: number;
  maxTotal: number;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFilterReportPage');
  }

  closeModal(){
    this.modalCtrl.dismiss({startDate: this.startDate, endDate: this.endDate, txtMinT: this.minTotal, txtMaxT: this.maxTotal});
  }

  closeModalCancel(){
    this.modalCtrl.dismiss({result: false});
  }

}
