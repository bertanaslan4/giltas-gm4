import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular' 

@Component({
  selector: 'app-modal-report-proposal-filter',
  templateUrl: './modal-report-proposal-filter.page.html',
  styleUrls: ['./modal-report-proposal-filter.page.scss'],
})
export class ModalReportProposalFilterPage implements OnInit {

  startDate: string;  
  endDate: string;
  orderNumber: string;
  customerName: string;

  constructor(public navCtrl: NavController, public modalCtlr: ModalController) {

   }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFilterOrderPage');
  }

  closeModal(){
    this.modalCtlr.dismiss({startDate: this.startDate, endDate: this.endDate, orderNumber: this.orderNumber, customerName: this.customerName});
  }

  closeModalCancel(){
    this.modalCtlr.dismiss({result: false});
  }

}
