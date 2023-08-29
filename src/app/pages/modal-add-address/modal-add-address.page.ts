import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service'
import { EnvService } from 'src/app/services/env.service';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.page.html',
  styleUrls: ['./modal-add-address.page.scss'],
})
export class ModalAddAddressPage implements OnInit {

  detail_world: any ;// delete
  detail_Address: any;
  detail_AddressTypeCode: any;
  detail_CountryCode: any; // 'TR'
  detail_CountryCodenew: any; // delete
  detail_StateCode: any ;
  selectedState: any = [];
  detail_CityCode: any ;
  selectedCity: any[] = [];
  selectedDistrict: any[] = [];
  detail_DistrictCode: any;

  detail_QuarterName: any;
  detail_StreetName: any;

  detail_BuildingNum: number = 0;
  detail_FloorNum: number = 0;
  detail_DoorNum: number = 0;
  stateList: any[] = [];
  cityList: any[] = [];
  districtList: any[] = [];
  worldList: any[] = [];
  addressDescriptions: any[] = [
    { "Code": "1", "Value": "Ev Adresi" },
    { "Code": "2", "Value": "İş Adresi" },
    { "Code": "3", "Value": "Merkez Ofis" },
    { "Code": "4", "Value": "Eski Ev Adresi" }
  ];
  addrData = { "ProcName": "", "Parameters": [{ "Name": "Parent", "Value": "" }, { "Name": "Language", "Value": "TR" }] };
  GetData = { "ProcName": "G4_GetCountries", "Parameters": [{ "Name": "Language", "Value": "TR" }] };

  constructor(public serverService: ServerService, public envService: EnvService, public navCtrl: NavController,
    public modalCtrl: ModalController) {
  }

  ngOnInit() {



    this.getWorldCountriese();
    // ---
    this.getStates();
    this.getCities(this.detail_StateCode);
    this.getDistricts(this.detail_CityCode);
    this.checkDistricts(this.serverService.Settings.V3Settings.OfficeCode);
  }

  portChange(event) {
    this.detail_world = event.value['Code'];
    console.log('value:', event.value['Code']);
    console.log(this.detail_world);
    if (this.detail_world == 'TR') this.getStates();
  }

  closeModalCancel() {
    this.modalCtrl.dismiss({ result: false });
  }

  getWorldCountriese() {
    this.serverService.getAny(this.GetData).then(res => {
      console.log("world list", res);
      this.worldList = res;
    })
  }

  returnAddressData(form: NgForm) {

    console.log("Form Values", form.value);
    if (!form.value.detail_Address) form.value.detail_Address = '';

    if (this.detail_world != 'TR') {
      this.modalCtrl.dismiss({
        txtDAddress: form.value.detail_Address,
        txtDaddtype: form.value.detail_AddressTypeCode,
        txtDCoCode: form.value.detail_world,
        txtDSCode: this.detail_world,
        txtDCiCode: this.detail_world,
        txtDDCode: this.detail_world,

        txtDStreetCode: form.value.detail_StreetName,
        txtDNeighborHoodCode: form.value.detail_QuarterName,

        txtDBNum: form.value.detail_BuildingNum,
        txtDFNum: form.value.detail_FloorNum,
        txtDDNum: form.value.detail_DoorNum,
        result: true
      })
    } else {
      if (!form.value.detail_world) form.value.detail_world = 'TR';
      this.modalCtrl.dismiss({
        txtDAddress: form.value.detail_Address,
        txtDaddtype: form.value.detail_AddressTypeCode,
        txtDCoCode: form.value.detail_world,

        txtDSCode: form.value.detail_StateCode.Code,
        txtDCiCode: form.value.detail_CityCode.Code,        
        txtDDCode: form.value.detail_DistrictCode.Code,

        txtDStreetCode: form.value.detail_StreetName,
        txtDNeighborHoodCode: form.value.detail_QuarterName,

        txtDBNum: form.value.detail_BuildingNum,
        txtDFNum: form.value.detail_FloorNum,
        txtDDNum: form.value.detail_DoorNum,
        result: true
      })
    }

  }

  getStates() {
    this.addrData.ProcName = "G4_GetStates";
    this.addrData.Parameters[0].Value = 'TR';
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.stateList = res;
        this.selectedState = res.filter(x => x.Code == this.detail_StateCode)
        // this.cityList = [];
        // this.districtList = [];
        console.log(this.selectedState)
        console.log(res);
      }).catch(this.envService.handleError);
  }

  getCities(code) {
    console.log(code)
    this.addrData.ProcName = "G4_GetCities";
    this.addrData.Parameters[0].Value = code
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.cityList = res;
        console.log(this.cityList)
        this.selectedCity = res.filter(x => x.Code == this.detail_CityCode)

        // this.districtList = [];
        console.log(res);
      })
      .catch(this.envService.handleError);
  }
  getDistricts(code) {
    this.addrData.ProcName = "G4_GetDistricts";
    this.addrData.Parameters[0].Value = code;
    this.serverService.getAny(this.addrData)
      .then(res => {
        console.log(res)
        this.districtList = res;
        this.selectedDistrict = res.filter(x => x.Code == this.detail_DistrictCode)
        console.log(this.selectedDistrict);
      })
      .catch(this.envService.handleError);
  }

  closeModal() {
    this.modalCtrl.dismiss({ result: false });
  }
  // delete
  onCountryChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('country:', event.value);
    this.detail_world = event.value.Code;
    console.log('detail_world:', this.detail_world);

  }

  onStateChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log(event)
    this.getCities(event.value.Code);
  }

  onCityChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log(event.value.Code)
    this.getDistricts(event.value.Code)
  }

  checkDistricts(officeCode) {
    if (officeCode == 's01') this.detail_DistrictCode = 'TR.03504'
    else if (officeCode == 's02') this.detail_DistrictCode = 'TR.03504'//bornova
    else if (officeCode == 's03') this.detail_DistrictCode = 'TR.03501'//karşıyaka
    else if (officeCode == 's04') this.detail_DistrictCode = 'TR.03520'//üçkuyular
    else if (officeCode == 's05') this.detail_DistrictCode = 'TR.03520'//şirinyer
    else if (officeCode == 's06') this.detail_DistrictCode = 'TR.03500'//manisa
    else if (officeCode == 's07') this.detail_DistrictCode = 'TR.03500'//nokta
    else if (officeCode == 's08') this.detail_DistrictCode = 'TR.03500'//bozyaka
    else if (officeCode == 's11') this.detail_DistrictCode = 'TR.03520'//forbes
    else if (officeCode == 's12') this.detail_DistrictCode = 'TR.03500'//bayraklı
    else if (officeCode == 's13') this.detail_DistrictCode = 'TR.03526'//gaziemir
    else if (officeCode == 's14') this.detail_DistrictCode = 'TR.03527'//narlıdere
    else if (officeCode == 's15') this.detail_DistrictCode = 'TR.03500'//turgutlu
    else if (officeCode == 's16') this.detail_DistrictCode = 'TR.03517'//torbalı
    else if (officeCode == 's17') this.detail_DistrictCode = 'TR.03525'//çiğli
    else if (officeCode == 's18') this.detail_DistrictCode = 'TR.03513'//ödemiş
    else if (officeCode == 's19') this.detail_DistrictCode = 'TR.03500'//aydın
    else if (officeCode == 's20') this.detail_DistrictCode = 'TR.03500'//denizli
    else if (officeCode == 's21') this.detail_DistrictCode = 'TR.03500'//salihli
    else if (officeCode == 's22') this.detail_DistrictCode = 'TR.03500'//çamdibi
    else if (officeCode == 's24') this.detail_DistrictCode = 'TR.03500'//balıkesir

    console.log(officeCode, this.detail_DistrictCode)
  }

}
