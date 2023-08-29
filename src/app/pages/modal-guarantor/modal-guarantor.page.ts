import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service'
import { EnvService } from 'src/app/services/env.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-modal-guarantor',
  templateUrl: './modal-guarantor.page.html',
  styleUrls: ['./modal-guarantor.page.scss'],
})
export class ModalGuarantorPage implements OnInit {


  //loading: Loading;
  number10: any;
  number11: any;
  total1: any;
  total2: any;

  guarantorName: any;
  guarantorLastName: any;
  guarantorIdentityNum: any;
  guarantorTel: any;
  detail_Address: any;
  detail_AddressTypeCode: any;
  detail_CountryCode: any = 'TR';
  detail_StateCode: any;
  detail_CityCode: any;
  detail_DistrictCode: any;


  detail_StreetName: any;
  detail_QuarterName: any;

  detail_BuildingNum: number = 0;
  detail_FloorNum: number = 0;
  detail_DoorNum: number = 0;
  stateList: any[] = [];
  cityList: any[] = [];
  districtList: any[] = [];

  personelInfo_BirthPlace: any;
  personelInfo_MotherName: any;
  personelInfo_FatherName: any;
  personelInfo_MaidenName: any;
  personelInfo_MonthlyIncome: any;
  personelInfo_DrivingLicenceType: any;
  personelInfo_DrivingLicenceTypeNum: any;
  personelInfo_IdentityCardNum: any;
  personelInfo_RegisteredCityCode: any;
  personelInfo_RegisteredDistrictCode: any;
  personelInfo_RegisteredTown: any;
  personelInfo_RegisteredNum: any;
  personelInfo_RegisteredRecordNum: any;
  personelInfo_RegisteredFamilyNum: any;
  personelInfo_RegisteredFileNum: any;
  personelInfo_SocialInsuranceNumber: any;
  personelInfo_BirthDate: any;
  personelInfo_GenderCode: any;


  addressDescriptions: any[] = [
    { "Code": "1", "Value": "Ev Adresi" },
    { "Code": "2", "Value": "İş Adresi" }
  ];
  addrData = { "ProcName": "", "Parameters": [{ "Name": "Parent", "Value": "" }, { "Name": "Language", "Value": "TR" }] };


  genderCode: any[] = [
    { "Code": "1", "Value": "Erkek" },
    { "Code": "2", "Value": "Kadın" },
    { "Code": "0", "Value": "Bilinmiyor" }
  ];
  monthlyIncome: any[] = [
    { "Code": "0", "Value": "Belirtilmemiş" },
    { "Code": "2000", "Value": "2000 ₺" },
    { "Code": "2500", "Value": "2500 ₺" },
    { "Code": "3000", "Value": "3000 ₺" },
    { "Code": "3500", "Value": "3500 ₺" },
    { "Code": "4000", "Value": "4000 ₺" },
    { "Code": "5000", "Value": "5000 ₺" },
    { "Code": "10000", "Value": "5000 ₺ ++" }
  ];
  drivingLicenceType: any[] = [
    { "Code": "A", "Value": "A" },
    { "Code": "B", "Value": "B" },
    { "Code": "C", "Value": "C" },
    { "Code": "D", "Value": "D" },
    { "Code": "E", "Value": "E" },
    { "Code": "F", "Value": "F" }
  ];


  constructor(public serverService: ServerService, public envService: EnvService, public navCtrl: NavController,
    public modalCtrl: ModalController) {

  }

  ngOnInit() {
    this.getStates();
  }


  returnGuarantorData() {
    this.personelInfo_BirthDate = this.serverService.convertIonic4Date(this.personelInfo_BirthDate)
    console.log(this.personelInfo_BirthDate, this.personelInfo_GenderCode)
    if (!this.detail_AddressTypeCode || !this.detail_StateCode || !this.detail_CityCode ||
      !this.detail_DistrictCode || !this.guarantorTel || !this.guarantorIdentityNum ||
      !this.personelInfo_BirthDate || !this.personelInfo_BirthPlace || !this.personelInfo_GenderCode) {
      this.envService.presentAlert("Uyarı", "Lütfen Zorunlu Alanları Doldurunuz.");
      return;
    }
    if (!this.guarantorName) this.guarantorName = '';
    if (!this.guarantorLastName) this.guarantorLastName = '';
    if (!this.detail_Address) this.detail_Address = '';


    this.modalCtrl.dismiss({
      txtGname: this.guarantorName,
      txtGLname: this.guarantorLastName,
      txtGInumber: this.guarantorIdentityNum,
      txtGtel: this.guarantorTel,
      txtDAddress: this.detail_Address,
      txtDaddtype: this.detail_AddressTypeCode,
      txtDCoCode: this.detail_CountryCode,
      txtDSCode: this.detail_StateCode,
      txtDCiCode: this.detail_CityCode,
      txtDDCode: this.detail_DistrictCode,

      txtDStreetCode: this.detail_StreetName,
      txtDNeighborHoodCode: this.detail_QuarterName,

      txtDBNum: this.detail_BuildingNum,
      txtDFNum: this.detail_FloorNum,
      txtDDNum: this.detail_DoorNum,

      personelInfo_BirthPlace: this.personelInfo_BirthPlace,
      personelInfo_MotherName: this.personelInfo_MotherName,
      personelInfo_FatherName: this.personelInfo_FatherName,
      personelInfo_MaidenName: this.personelInfo_MaidenName,
      personelInfo_MonthlyIncome: this.personelInfo_MonthlyIncome,
      personelInfo_DrivingLicenceType: this.personelInfo_DrivingLicenceType,
      personelInfo_DrivingLicenceTypeNum: this.personelInfo_DrivingLicenceTypeNum,
      personelInfo_IdentityCardNum: this.personelInfo_IdentityCardNum,
      personelInfo_RegisteredCityCode: this.personelInfo_RegisteredCityCode,
      personelInfo_RegisteredDistrictCode: this.personelInfo_RegisteredDistrictCode,
      personelInfo_RegisteredTown: this.personelInfo_RegisteredTown,
      personelInfo_RegisteredNum: this.personelInfo_RegisteredNum,
      personelInfo_RegisteredRecordNum: this.personelInfo_RegisteredRecordNum,
      personelInfo_RegisteredFamilyNum: this.personelInfo_RegisteredFamilyNum,
      personelInfo_RegisteredFileNum: this.personelInfo_RegisteredFileNum,
      personelInfo_SocialInsuranceNumber: this.personelInfo_SocialInsuranceNumber,
      personelInfo_BirthDate: this.personelInfo_BirthDate,
      personelInfo_GenderCode: this.personelInfo_GenderCode

    });
  }

  getStates() {
    this.addrData.ProcName = "G4_GetStates";
    this.addrData.Parameters[0].Value = 'TR';
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.stateList = res;
        console.log(res);
      }).catch(this.envService.handleError);
  }

  getCities(code) {
    this.addrData.ProcName = "G4_GetCities";
    this.addrData.Parameters[0].Value = code
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.cityList = res;
        console.log(res);
      })
      .catch(this.envService.handleError);
  }
  getDistricts(code) {
    this.addrData.ProcName = "G4_GetDistricts";
    this.addrData.Parameters[0].Value = code;
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.districtList = res;
        console.log(res);
      })
      .catch(this.envService.handleError);
  }

  onStateChange() {
    let code = this.detail_StateCode;
    this.getCities(code);

  }
  onCityChange() {
    let code = this.detail_CityCode;
    this.getDistricts(code)
  }

  oninput(event) {
    if (this.guarantorIdentityNum.length == 11 && this.guarantorIdentityNum != '11111111111' && this.guarantorIdentityNum != '22222222222') {

      let bir = this.guarantorIdentityNum.substring(0, 1);
      let iki = this.guarantorIdentityNum.substring(1, 2);
      let uc = this.guarantorIdentityNum.substring(2, 3);
      let dort = this.guarantorIdentityNum.substring(3, 4);
      let bes = this.guarantorIdentityNum.substring(4, 5);
      let alti = this.guarantorIdentityNum.substring(5, 6);
      let yedi = this.guarantorIdentityNum.substring(6, 7);
      let sekiz = this.guarantorIdentityNum.substring(7, 8);
      let dokuz = this.guarantorIdentityNum.substring(8, 9);
      let on = this.guarantorIdentityNum.substring(9, 10);
      let onbir = this.guarantorIdentityNum.substring(10, 11);
      let int1 = parseInt(bir);
      let int2 = parseInt(iki);
      let int3 = parseInt(uc);
      let int4 = parseInt(dort);
      let int5 = parseInt(bes);
      let int6 = parseInt(alti);
      let int7 = parseInt(yedi);
      let int8 = parseInt(sekiz);
      let int9 = parseInt(dokuz);
      let int10 = parseInt(on);
      let int11 = parseInt(onbir);

      //global değişkenlere atama
      this.number10 = int10;
      this.number11 = int11;

      if (int1 != 0) {
        this.total1 = ((int1 + int2 + int3 + int4 + int5 + int6 + int7 + int8 + int9 + int10) % 10)
        this.total2 = ((((int1 + int3 + int5 + int7 + int9) * 7) - (int2 + int4 + int6 + int8)) % 10)
        if (this.total1 == int11 && this.total2 == int10) {
          console.log('Geçerli TC Kimlik Numarası');
        } else {
          this.envService.presentAlert('Hata', 'Hatalı TC Kimlik Numarası Girdiniz');
          // return 0;
        }
      } else {
        this.envService.presentAlert('Hata', 'TC Kimlik Numarası 0 ile Başlayamaz.')
        // return 0;
      }
    }
  }
  maxLength(event: KeyboardEvent, field, maxlength) {
    let input = $('#' + field).find('input');
    if (input.length > 0) {
      //return /\d|Backspace/.test(event.key);
      if ([8, 9, 13, 27, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        // backspace, enter, escape, arrows, tab
        return true;
      } else if (event.keyCode >= 48 && event.keyCode <= 57) {
        // numbers 0 to 9
        return (input.val().toString().length < maxlength);
      } else if (event.keyCode >= 96 && event.keyCode <= 105) {
        // numpad number
        return (input.val().toString().length < maxlength);
      }
      return false;
    }
    else return false;

  }

  closeModalCancel() {
    this.modalCtrl.dismiss({ result: false });
  }
}
