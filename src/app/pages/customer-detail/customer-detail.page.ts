//2102
import { Component, OnInit ,AfterContentInit} from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { EnvService } from 'src/app/services/env.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { Platform, AlertController, ModalController, NavController } from '@ionic/angular';
import { Customer, CurrAccPersonalInfo, CurrAccDefault } from 'src/app/models/customer';
import { CustomerDebit, Exception } from 'src/app/models/models';
import * as $ from 'jquery';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalAddAddressPage } from 'src/app/pages/modal-add-address/modal-add-address.page';
import { ModalAttributeTypePage } from 'src/app/pages/modal-attribute-type/modal-attribute-type.page';
import { ModalGuarantorPage } from 'src/app/pages/modal-guarantor/modal-guarantor.page';
import { ModalCountryPage } from 'src/app/pages/modal-country/modal-country.page';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.page.html',
  styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements AfterContentInit {

  compareFn(o1, o2): boolean {
    console.log(o1)
    console.log(o2)
    return o2 ? o1 === o2 : o1 === o2;
  };

  //compareWith = this.compareWithFn

  navParam: any;
  pageRoute: any;

  customer: Customer;
  personelInfo: CurrAccPersonalInfo;
  currAccDefault: CurrAccDefault;
  customerModel: any = {
    "ModelType": 3, // TODO Set
    "CurrAccCode": "",
    "FirstName": "",
    "LastName": "",
    "CurrAccDescription": "",
    "OfficeCode": "M", // TODO Set
    "RetailSalePriceGroupCode": "",// TODO Set
    "WholeSalePriceGroupCode": "",
    "IdentityNum": "",
    "TaxOfficeCode": "",
    "TaxNumber": "",
    "CreditLimit": 7000, // TODO Set
    "CurrencyCode": "TRY",
    "PostalAddresses": [],
    "Attributes": [],
    "Communications": [],
    "CurrAccPersonalInfo": {},
    "CurrAccDefault": {}
  };

  world_check: any = "TR";
  installments: any;
  installments_summary = [];
  curPlans: any[] = new Array();
  extras_summary = [];
  customerDebit: CustomerDebit;
  buttonClicked: boolean = false;
  showBack: boolean = false;
  overduePayment = [];
  attributes: any;
  guarantors: any;
  showImage: boolean;
  data: any = [];
  editMode: boolean = false;
  newMode: boolean = false;

  streetNameReadMode: boolean = false; // integratörde hata var. Cadde ismini push ederken "StreetName" olarak kabul ediyor. Pull ederken ise "Street" olarak döndürüyor. :S

  countryList = [];
  place = "TRY";
  imageURL: any;
  imageNameReturn: boolean;
  public checkimage: boolean = false;
  base64Image: string;
  datestring: string;
  customerInformation: any;
  customerWarning: any;
  stateList: any[] = [];
  cityList: any[] = [];
  districtList: any[] = [];
  attributeType17List: any[] = [];
  customerExtra: any;
  taxOffices: any[] = [];
  taxOfficesTemp: any[] = [];
  currencyTemp: any[] = [];
  imageName: string;
  tempTax: string;
  tempTaxCheck: boolean = false;
  currencyCheck: boolean = false;

  CountryCode: 'TR';

  //TC Kimlik Numarası 
  total1: any;
  total2: any;
  number10: any;
  number11: any;

  //customer Attributes
  AttributeCode13: any;
  AttributeCode14: any;
  AttributeCode17: any;
  AttDesc17: any;

  index: number = 0; //adress array count


  customersData = {
    "ProcName": "G4_CustomerListRetailNEW", "Parameters": [{ "Name": "FirstName", "Value": "" }, { "Name": "LastName", "Value": "" },
    { "Name": "IdentityNumber", "Value": "" }, { "Name": "TaxNumber", "Value": "" }, { "Name": "PhoneNumber", "Value": "" },
    { "Name": "Code", "Value": "" }, { "Name": "FirstLastName", "Value": "" }]
  };

  g4_LogData = {
    "ProcName": "G4_AddLog", "Parameters": [{ "Name": "UserID", "Value": "" }, { "Name": "Action", "Value": "" },
    { "Name": "Request", "Value": "" }, { "Name": "Response", "Value": "" }]
  };

  userData = { "ProcName": "", "Parameters": [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "LangCode", "Value": "TR" }] };
  overdueData = { "ProcName": "", "Parameters": [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "OfficeCode", "Value": "TR" }] };
  guarantorsData = { "ProcName": "G4_GetGuarantors", "Parameters": [{ "Name": "CurrAccCode", "Value": "" }] };
  addrData = { "ProcName": "", "Parameters": [{ "Name": "Parent", "Value": "" }, { "Name": "Language", "Value": "TR" }] };
  addCountryData = { "ProcName": "", "Parameters": [{ "Name": "Language", "Value": "TR" }] };
  taxOfficeData = { "ProcName": "G4_GetTaxOffices", "Parameters": [{ "Name": "Language", "Value": "TR" }] };
  taxOfficeDataDesc = { "ProcName": "G4_GetCustomerTaxOfficeDescription", "Parameters": [{ "Name": "TaxCode", "Value": "" }, { "Name": "Language", "Value": "TR" }] };

  updateAddressData = { "ProcName": "G4_SetCustomerPostalAddresses", "Parameters": [{ "Name": "CurrAccCode", "Value": "" }] }
  userinformation = { "ProcName": "G4_GetCustomerInformation", "Parameters": [{ "Name": "CurrAccCode", "Value": "" }] }
  userwarning = { "ProcName": "G4_GetCustomerWarning", "Parameters": [{ "Name": "CurrAccCode", "Value": "" }] }


  identityNumCheckArray: any[] = [];
  genderCode: any[] = [
    { "Code": "1", "Value": "Erkek" },
    { "Code": "2", "Value": "Kadın" },
    { "Code": "3", "Value": "Bilinmiyor" }
  ];
  addressDescriptions: any[] = [
    { "Code": "1", "Value": "Ev Adresi" },
    { "Code": "2", "Value": "İş Adresi" },
    { "Code": "3", "Value": "Merkez Ofis" },
    { "Code": "4", "Value": "Eski Ev Adresi" }
  ];
  customerAttributeDesc13: any[] = [
    { "Code": "0-1", "Value": "0-1" },
    { "Code": "1-3", "Value": "1-3" },
    { "Code": "3-5", "Value": "3-5" },
    { "Code": "5-7", "Value": "5-7" },
    { "Code": "7+", "Value": "7 ve üzeri" }
  ];
  customerAttributeDesc14: any[] = [
    { "Code": "1", "Value": "Kendi Evi" },
    { "Code": "2", "Value": "Kiracı" },
    { "Code": "3", "Value": "Kapıcı" },
    { "Code": "4", "Value": "Aile ile Oturuyor" },
    { "Code": "5", "Value": "Lojman" },
    { "Code": "6", "Value": "Akraba Evi" },
    { "Code": "x", "Value": "x" }
  ];
  drivingLicenceType: any[] = [
    { "Code": "A", "Value": "A" },
    { "Code": "B", "Value": "B" },
    { "Code": "C", "Value": "C" },
    { "Code": "D", "Value": "D" },
    { "Code": "E", "Value": "E" },
    { "Code": "F", "Value": "F" }
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
  registeredCityCode: any[] = [
    { "Code": "TR.06", "Value": "Ankara" },
    { "Code": "TR.34", "Value": "İstanbul" },
    { "Code": "TR.35", "Value": "İzmir" }
  ]
  constructor(
    public envService: EnvService,
    public serverService: ServerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translateService: TranslateService,
    private camera: Camera,
    public platform: Platform,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController) {
    this.pageRoute = this.router.routerState.snapshot.url;
    if (this.pageRoute != '/tabs/customers/customer-detail') {
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.customer = this.router.getCurrentNavigation().extras.state.customer;
          this.showImage = this.router.getCurrentNavigation().extras.state.showImage;
          if (this.showImage) {
            this.imageURL = this.serverService.Settings.G3Settings.ImageUrl + '/Home/GetThumbCustomer?curracccode=' + this.customer.CurrAccCode;
          } else {
            this.imageURL = "";
            console.log("Resim Boş");
          }
        }
      });
    }
    this.data = false;
    this.streetNameReadMode = false;
  }


  ngAfterContentInit() {
    this.envService.presentLoading();
    this.checkCustomerStatus();
    this.CurrencyPlans();
    //console.log('data222', this.data);
    // if data come from AWS Identity service - TC 
    if (this.data) {
      this.customerModel.IdentityNum = this.data[0];
      this.customerModel.LastName = this.data[1];
      this.customerModel.FirstName = this.data[2];
      this.personelInfo = new CurrAccPersonalInfo();
      this.personelInfo.FatherName = this.data[3];
      this.personelInfo.MotherName = this.data[4];
      this.personelInfo.BirthPlace = this.data[5];
      this.datestring = this.data[6];
      this.datestring.substring(10, 6) + "-" + this.datestring.substring(5, 3) + "-" + this.datestring.substring(0, 2);
      console.log(this.datestring);
      this.personelInfo.BirthDate = new Date(this.datestring).toISOString();
      this.personelInfo.RegisteredTown = this.data[7];
      this.personelInfo.RegisteredFileNum = this.data[8];
      this.personelInfo.RegisteredFamilyNum = this.data[9];
      this.personelInfo.RegisteredNum = this.data[10];
      //this.personelInfo.BirthDate = new Date("14.04.1984").toISOString();
    } else {

      this.getTaxOffices();
      this.getCountries();

      console.log('is new mode', !this.newMode)
      if (!this.newMode) {
        this.userData.ProcName = "G4_GetCustomerPostalAddress";
        this.userData.Parameters[0].Value = this.customerModel.CurrAccCode;
        this.serverService.getAny(this.userData).then(res => {
          this.customerModel.PostalAddresses = res;
          this.customerModel.TaxOfficeCode = this.customerModel.PostalAddresses[0].TaxOfficeCode;
          this.getAddressData();
        }).catch(this.envService.handleError);

        //console.log('customer : ',this.customer);

        //console.log('customerModel : ',this.customerModel);

        this.userData.ProcName = "G4_GetCustomerCommunications";
        this.serverService.getAny(this.userData).then(res => {
          console.log('communications', res)
          console.log(res)
          this.customerModel.Communications = res;
        }).catch(this.envService.handleError);

        console.log('TaxOfficeCode : ', this.customerModel);

        this.getTaxOfficesDesc();
        this.getGuarantors();
        this.getPersonelInfo();
        this.getCustomerAttribute();
      }

      if (this.serverService.Settings.V3Settings.SalesType) {
        if (this.serverService.Settings.V3Settings.SalesType == 1 || this.serverService.Settings.V3Settings.SalesType == 2) {
          this.userData.ProcName = "G4_GetCustomerDebit";
          this.serverService.getAny(this.userData)
            .then(res => {
              console.log('debit', res);
              this.customerDebit = res;
            })
            .catch(this.envService.handleError);
          console.log(this.serverService.Settings.V3Settings.OfficeCode)
          this.overdueData.ProcName = "G4_GetCustomerOverduePayment";
          this.overdueData.Parameters[0].Value = this.customer.CurrAccCode;
          this.overdueData.Parameters[1].Value = this.serverService.Settings.V3Settings.OfficeCode;
          this.serverService.getAny(this.overdueData)
            .then(res => {
              console.log('overduePayment', res);
              this.overduePayment = res;
            })
        }

        if (this.serverService.Settings.V3Settings.SalesType == 2) {
          this.userData.ProcName = "G4_GetCustomerInstallments";
          this.serverService.getAny(this.userData)
            .then(res => {
              console.log('installments');
              this.installments = res;
              let debit: number = 0;
              let desc: string = '';
              let date: string = '';
              for (let installement of this.installments) {
                if (date != installement.MonthYear) {
                  if (debit > 0) {
                    let installement_summary = {
                      DueDate: date,
                      ApplicationDescription: desc,
                      InstallmentAmount: debit.toFixed(2)
                    };
                    this.installments_summary.push(installement_summary);
                    debit = parseFloat(installement.InstallmentAmount);
                    desc = installement.ApplicationDescription;
                    date = installement.MonthYear;
                  }
                  else {
                    date = installement.MonthYear;
                    desc = installement.ApplicationDescription;
                    debit += parseFloat(installement.InstallmentAmount);
                  }
                }
                else {
                  debit += parseFloat(installement.InstallmentAmount);
                }
              }
              console.log(this.installments);
              console.log(this.installments_summary);
            })
            .catch(this.envService.handleError);
        }
      }
    }
  }

  ionViewDidEnter() {
    //console.log('wqeqweqweqweqweqw');
  }


  dismiss(item: any) {
    this.modalCtrl.dismiss();
  }

  getAttributeType17() {
    let addData = { "ProcName": "G4_GetAttributeType17", "Parameters": [{ "Name": "Parent", "Value": "" }, { "Name": "Code", "Value": "" }] }
    addData.Parameters[0].Value = "";
    if (this.AttributeCode17) {
      addData.Parameters[1].Value = this.AttributeCode17
    } else {
      addData.Parameters[1].Value = ""
    }
    this.serverService.getAny(addData)
      .then(res => {
        this.attributeType17List = res;
        if (res[0] && res[0].AttributeDescription)
          this.AttDesc17 = res[0].AttributeDescription
        console.log('getAttributeType17', this.attributeType17List);
      })
  }


  async clickJobStuation() {
    let modal;
    modal = await this.modalCtrl.create({
      component: ModalAttributeTypePage

    });
    await modal.present();

    modal.onDidDismiss(data => {
      console.log("modal.onDidDismiss", data);
      this.AttributeCode17 = data.txtAttCode17;
      if (data.txtAttDesc17 != "")
        this.AttDesc17 = data.txtAttDesc17;
      this.getAttributeType17();
      this.addCustomerAttribute17(this.customerModel.CurrAccCode)

    });
  }

  takePictureWeb() {
    let self: any = this;
    var fup = {
      fileSelector: document.createElement('input'),
      outputArea: undefined,
      listImages: function (evt) {
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          let data: any = e.target
          self.base64Image = data.result;
          //self.imageURL = data.result.replace('data:image/jpeg;base64,', '');                                    
          self.checkimage = true;
          self.imagePrompt();
        };
        reader.readAsDataURL(file);
      }
    };

    fup.fileSelector.setAttribute('type', 'file');
    fup.fileSelector.setAttribute('accept', '.jpg');
    fup.fileSelector.onchange = function (event) {
      fup.listImages(event);
    };
    fup.fileSelector.click();
  }

  takePicture() {
    if (this.platform.is("cordova")) this.openCamera();
    else this.takePictureWeb();
  }

  openCamera() {
    this.serverService.isOpenCamera = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 330,
      targetHeight: 290,
      allowEdit: true,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.serverService.isOpenCamera = false;

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.checkimage = true;
      this.imagePrompt();
    }, (err) => {
    });

  }

  presentPersonalInfoAlertRadio() {
    this.personelInfo = new CurrAccPersonalInfo();
  }

  oninput(event) {
    this.customerModel.IdentityNum = event.detail.value;
    if (this.customerModel.IdentityNum.length == 11 && this.customerModel.IdentityNum != '11111111111' && this.customerModel.IdentityNum != '22222222222') {
      //console.log("bbbbb")
      let bir = this.customerModel.IdentityNum.substring(0, 1);
      let iki = this.customerModel.IdentityNum.substring(1, 2);
      let uc = this.customerModel.IdentityNum.substring(2, 3);
      let dort = this.customerModel.IdentityNum.substring(3, 4);
      let bes = this.customerModel.IdentityNum.substring(4, 5);
      let alti = this.customerModel.IdentityNum.substring(5, 6);
      let yedi = this.customerModel.IdentityNum.substring(6, 7);
      let sekiz = this.customerModel.IdentityNum.substring(7, 8);
      let dokuz = this.customerModel.IdentityNum.substring(8, 9);
      let on = this.customerModel.IdentityNum.substring(9, 10);
      let onbir = this.customerModel.IdentityNum.substring(10, 11);
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
        //console.log("ccc")
        this.total1 = ((int1 + int2 + int3 + int4 + int5 + int6 + int7 + int8 + int9 + int10) % 10)
        this.total2 = ((((int1 + int3 + int5 + int7 + int9) * 7) - (int2 + int4 + int6 + int8)) % 10)
        if (this.total1 == int11 && this.total2 == int10) {
          console.log('Geçerli TC Kimlik Numarası');
          this.getCustomersByIdentityNum();
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

  getCustomersByIdentityNum() {
    this.customersData.Parameters[2].Value = this.customerModel.IdentityNum
    this.serverService.getAny(this.customersData)
      .then(res => {
        this.identityNumCheckArray = res;
        if (res.length > 0) {
          this.envService.presentAlert('Bilgi', `Kayıtlı Müşteri. <hr />${res[0].FirstName + ' ' + res[0].LastName}`)
        } else {
          this.envService.presentAlert('Bilgi', 'Yeni Müşteri.');
        }
      })
  }



  onButtonClick() {
    this.buttonClicked = !this.buttonClicked;
    if (this.buttonClicked && this.customer.CurrAccCode) {
      this.envService.presentLoading();
      this.userinformation.Parameters[0].Value = this.customer.CurrAccCode;
      this.serverService.getAny(this.userinformation).then(res => {
        console.log('G4_GetCustomerInformation');
        console.log(res);
        this.customerInformation = res;
        this.envService.dismissLoading();
      }).catch(error => this.envService.handleError(error));
      this.userwarning.Parameters[0].Value = this.customer.CurrAccCode;
      this.serverService.getAny(this.userwarning).then(res => {
        console.log('G4_GetCustomerWarning');
        console.log(res);
        this.customerWarning = res;
        this.envService.dismissLoading();
      }).catch(error => this.envService.handleError(error));
    }
  }

  checkCustomerStatus() {
    if (this.customer == null) {
      this.newMode = true;
      this.editMode = true;
      this.customer = new Customer();
      this.currencyCheck = false;
    } else {
      this.currencyCheck = true;
      this.customerModel.CurrAccCode = this.customer.CurrAccCode;
      this.customerModel.FirstName = this.customer.CustomerName ? this.customer.CustomerName : this.customer.FirstName;
      this.customerModel.LastName = this.customer.LastName;
      this.customerModel.IdentityNum = this.customer.IdentityNum;
      this.customerModel.CurrencyCode = this.customer.CurrencyCode;
      this.customerModel.TaxNumber = this.customer.TaxNumber;
    }
    this.envService.dismissLoading();
  }

  optionsFn() {
    console.log(this.customerModel.CurrencyCode);
    this.customerModel.CurrencyCode = this.customerModel.CurrencyCode;
  }

  CurrencyPlans() {
    this.curPlans = [
      {
        "name": "TRY",
        "val": "TRY"
      },
      {
        "name": "EUR",
        "val": "EUR"
      },
      {
        "name": "USD",
        "val": "USD"
      },
    ];
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

  async addCommAddress() {

    let alert = await this.alertCtrl.create({
      header: 'İletişim Bilgileri',
      message: 'Eklemek İstediğiniz İletişim Tipini Seçiniz...',
      inputs: [
        {
          type: 'radio',
          label: 'Telefone',
          value: '1',
          checked: true
        },
        {
          type: 'radio',
          label: 'Fax',
          value: '2'
        },
        {
          type: 'radio',
          label: 'E-Posta',
          value: '3'
        },
        {
          type: 'radio',
          label: 'Mobile',
          value: '7'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Add',
          handler: data => {
            this.customerModel.Communications.push({
              CommunicationTypeCode: data,
              CommAddress: ""
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async imagePrompt() {
    let alert = await this.alertCtrl.create({
      header: 'Resim İsim Formatı',
      inputs: [
        {
          type: 'radio',
          label: '4A hizmet dökümü',
          value: '4A hizmet dökümü',

        },
        {
          type: 'radio',
          label: 'Dava dosyası',
          value: 'Dava dosyası',

        },
        {
          type: 'radio',
          label: 'İcra Dosyası',
          value: 'İcra Dosyası'
        },
        {
          type: 'radio',
          label: 'İkametgah',
          value: 'İkametgah'
        },
        {
          type: 'radio',
          label: 'Kimlik arka yüzü',
          value: 'Kimlik arka yüzü'
        },
        {
          type: 'radio',
          label: 'Kimlik ön yüzü',
          value: 'Kimlik ön yüzü'
        },
        {
          type: 'radio',
          label: 'Maaş bordrosu',
          value: 'Maaş bordrosu'
        },
        {
          type: 'radio',
          label: 'Taşınmaz kaydı',
          value: 'Taşınmaz kaydı'
        },
        {
          type: 'radio',
          label: 'Vergi levhası',
          value: 'Vergi levhası'
        }
      ],
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.imageNameReturn = false;
          }
        },
        {
          text: 'Tamam',
          handler: (data: string) => {
            this.imageName = this.generateImageName(data);
            this.imageNameReturn = true;
            console.log(this.imageName);

          }
        }
      ]
    });
    await alert.present();
  }

  generateImageName(data: any) {
    var tempName: string;
    if (data == "Kimlik ön yüzü") {
      tempName = data;
      tempName = tempName.replace(/\s/g, "_");
    } else {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      var datetime = localISOTime.substr(0, 10).replace('-', '_').replace('-', '_');
      var templocal = localISOTime.substr(11, 8).replace(':', '_').replace(':', '_');
      tempName = data + '_' + datetime + '_' + templocal;
      tempName = tempName.replace(/\s/g, "_");

    }
    return tempName;
  }

  getGuarantors() {
    this.guarantorsData.Parameters[0].Value = this.customerModel.CurrAccCode;
    //console.log('CurrAccCode : ',this.customerModel.CurrAccCode)
    this.serverService.getAny(this.guarantorsData)
      .then(res => {
        console.log('getGuarantors : ', res);
        if (Array.isArray(res)) this.guarantors = res;
      })
      .catch(this.envService.handleError);
  }

  getPersonelInfo() {
    this.userData.ProcName = "G4_GetCustomerPersonalInfo";
    //this.personelInfo.BirthDate = this.serverService.convertIonic4Date(this.personelInfo.BirthDate);
    this.serverService.getAny(this.userData)
      .then(res => {
        this.personelInfo = res[0];
        if (res[0] && res[0].BirthDate)
          this.personelInfo.BirthDate = this.serverService.convertISODate(res[0].BirthDate);
        console.log('personalInfo', this.personelInfo);
      })
      .catch(this.envService.handleError);
  }

  getCustomerAttribute() {
    this.userData.ProcName = "G4_GetCustomerAttributes";
    this.userData.Parameters[0].Value = this.customer.CurrAccCode;
    this.serverService.getAny(this.userData)
      .then(res => {
        this.attributes = res;
        for (let i = 0; i < res.length; i++) {
          if (res[i].AttributeTypeCode == 13) {
            this.AttributeCode13 = res[i].AttributeCode;
            console.log('AttributeCode13', this.AttributeCode13)
          } else if (res[i].AttributeTypeCode == 14) {
            this.AttributeCode14 = res[i].AttributeCode;
            console.log('AttributeCode14', this.AttributeCode14)
          } else if (res[i].AttributeTypeCode == 17) {
            this.AttributeCode17 = res[i].AttributeCode;
            this.getAttributeType17();
            console.log('AttributeCode17', this.AttributeCode17)
          }
        }
        console.log('CurrAccAttribute', res)
      })
      .catch(this.envService.handleError);
  }

  addCustomerAttribute13(CurrAccCode) {
    let addData = {
      "ProcName": "G4_AddCustomerAttributes", "Parameters":
        [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "AttributeTypeCode", "Value": 0 },
        { "Name": "AttributeCode", "Value": "" }, { "Name": "CreatedUserName", "Value": "" }]
    };
    addData.Parameters[0].Value = CurrAccCode;
    addData.Parameters[1].Value = 13;
    addData.Parameters[2].Value = this.AttributeCode13;
    addData.Parameters[3].Value = "V3   V3";
    this.serverService.getAny(addData);
    console.log(addData)
  }

  addCustomerAttribute14(CurrAccCode) {
    let addData = {
      "ProcName": "G4_AddCustomerAttributes", "Parameters":
        [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "AttributeTypeCode", "Value": 0 },
        { "Name": "AttributeCode", "Value": "" }, { "Name": "CreatedUserName", "Value": "" }]
    };
    addData.Parameters[0].Value = CurrAccCode;
    addData.Parameters[1].Value = 14;
    addData.Parameters[2].Value = this.AttributeCode14;
    addData.Parameters[3].Value = "V3   V3";
    this.serverService.getAny(addData);
    console.log(addData)
  }

  addCustomerAttribute17(CurrAccCode) {
    let addData = {
      "ProcName": "G4_AddCustomerAttributes", "Parameters":
        [{ "Name": "CurrAccCode", "Value": "" }, { "Name": "AttributeTypeCode", "Value": 0 },
        { "Name": "AttributeCode", "Value": "" }, { "Name": "CreatedUserName", "Value": "" }]
    };
    addData.Parameters[0].Value = CurrAccCode;
    addData.Parameters[1].Value = 17;
    addData.Parameters[2].Value = this.AttributeCode17;
    addData.Parameters[3].Value = "V3   V3";
    this.serverService.getAny(addData);
    console.log(addData)
  }


  getAddressData() {
    for (let i = 0; i < this.customerModel.PostalAddresses.length; i++) {

      console.log("is new mode , is edit mode", this.newMode, this.editMode);
      console.log("getAddressData customerModel.PostalAddresses", this.customerModel.PostalAddresses);
      this.addrData.ProcName = "G4_GetStates";
      this.addrData.Parameters[0].Value = this.customerModel.PostalAddresses[i].CountryCode;
      console.log("country code", this.customerModel.PostalAddresses[i].CountryCode);
      this.serverService.getAny(this.addrData)
        .then(res => {
          this.stateList[i] = res;
          console.log("state list", res);
          // this.streetNameReadMode = true;
        }).catch(this.envService.handleError);


      this.addrData.ProcName = "G4_GetCities";
      this.addrData.Parameters[0].Value = this.customerModel.PostalAddresses[i].StateCode;
      console.log("statecode", this.customerModel.PostalAddresses[i].StateCode);
      this.serverService.getAny(this.addrData)
        .then(res => {
          this.cityList[i] = res;
          console.log("city list", res);
          //console.log(this.cityList)
        })
        .catch(this.envService.handleError);

      this.addrData.ProcName = "G4_GetDistricts";
      this.addrData.Parameters[0].Value = this.customerModel.PostalAddresses[i].CityCode;
      console.log("citycode", this.customerModel.PostalAddresses[i].CityCode);
      this.serverService.getAny(this.addrData)
        .then(res => {
          console.log("districtlist", res);
          this.districtList[i] = res;

        })
        .catch(this.envService.handleError);

    }
  }

  getCountries() {
    this.addCountryData.ProcName = "G4_GetCountries";
    this.serverService.getAny(this.addCountryData)
      .then(res => {
        this.countryList.splice(this.index, 0, res)
        //this.countryList[this.index] = res;
        // console.log("getcountrieslist", this.countryList);
        // console.log("getcountrylistres", res);
      }).catch(this.envService.handleError);
  }

  getStates(country: any) {
    this.addrData.ProcName = "G4_GetStates";
    console.log("gelen country", country.Code);
    this.addrData.Parameters[0].Value = country.Code;
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.stateList.splice(this.index, 0, res);

        //this.stateList[this.index] = res;
        // console.log("getstatelist", this.stateList);
        // console.log("getstatelistres", res);
      })
      .catch(this.envService.handleError);
  }

  getCities(state: any) {
    this.addrData.ProcName = "G4_GetCities";
    console.log("gelen state", state);
    this.addrData.Parameters[0].Value = state;
    this.serverService.getAny(this.addrData)
      .then(res => {
        this.cityList.splice(this.index, 0, res);
        // console.log("getcitieslist", this.cityList);
        // console.log("getcitieslistres", res);
        //this.cityList[this.index] = res;
      })
      .catch(this.envService.handleError);
  }

  getDistricts(city: any) {
    this.addrData.ProcName = "G4_GetDistricts";
    this.addrData.Parameters[0].Value = city;

    this.serverService.getAny(this.addrData)
      .then(res => {
        this.districtList.splice(this.index, 0, res)
        //this.districtList[this.index] = res;
        // console.log("getdistrictlist", this.districtList);
        // console.log("getdistrictlistres", res);
      })
      .catch(this.envService.handleError);
  }

  getTaxOffices() {
    this.serverService.getAny(this.taxOfficeData)
      .then(res => {
        this.envService.dismissLoading();
        this.taxOffices = res;
        console.log(this.taxOffices);
      })
      .catch(this.envService.handleError);
  }

  getTaxOfficesDesc() {

    this.serverService.getAny(this.taxOfficeDataDesc)
      .then(res => {
        this.envService.dismissLoading();
        this.taxOfficesTemp = res[0].Value;
        if (res) {
          this.tempTaxCheck = true;
        }
      })
      .catch(this.envService.handleError);
    this.envService.dismissLoading();
  }

  addCustomer() {
    if (this.newMode != true) {
      // this.streetNameReadMode = false;
      let i = 0;
      let n = 0;
      for (i; i < this.customerModel.PostalAddresses.length; i++) {
        for (n; n < this.customerModel.PostalAddresses.length; n++) {
          if (i != n && i < n && this.customerModel.PostalAddresses[i].AddressTypeCode == this.customerModel.PostalAddresses[n].AddressTypeCode && this.customerModel.PostalAddresses[i].AddressTypeCode == 1) {
            this.customerModel.PostalAddresses[n].AddressTypeCode = 4;
          }
        }
      }
    } else {
      // this.streetNameReadMode = true;
      //console.log(this.customerModel.personalInfo[0].BirthDate)
      //console.log(this.personelInfo.BirthDate)
      if (this.world_check != 'TR') {
        if (this.customerModel.IdentityNum.length != 11 || !this.customerModel.PostalAddresses[0].AddressTypeCode) {
          this.envService.presentAlert("Uyarı", "Lütfen Zorunlu Alanları Doldurunuz.");
          return 0;
        }
      } else {
        if (this.customerModel.IdentityNum.length != 11 || !this.customerModel.PostalAddresses[0].AddressTypeCode ||
          !this.customerModel.PostalAddresses[0].StateCode || !this.customerModel.PostalAddresses[0].CityCode ||
          !this.customerModel.PostalAddresses[0].DistrictCode) {
          //console.log(this.customerModel.IdentityNum.length, this.customerModel.PostalAddresses[0].AddressTypeCode,
          //this.customerModel.PostalAddresses[0].StateCode, this.customerModel.PostalAddresses[0].CityCode,
          //this.customerModel.PostalAddresses[0].DistrictCode)
          this.envService.presentAlert("Uyarı", "Lütfen Zorunlu Alanları Doldurunuz.");
          return 0;
        }
      }

      if (this.customerModel.IdentityNum.length == 11) {
        if (this.customerModel.IdentityNum != '11111111111' && this.customerModel.IdentityNum != '22222222222') {
          if (this.total1 == this.number11 && this.total2 == this.number10) {
            console.log('Geçerli TC Kimlik No.');

            if (this.identityNumCheckArray.length == 0) {
              console.log('Geçerli ve Yeni TC Kimlik No.');

            } else {
              this.envService.presentAlert("Uyarı", "Bu TC Kimlik Numarası Eski Kayıtlarda Mevcuttur.");
              return 0;
            }
          } else {
            this.envService.presentAlert("Uyarı", "Geçerli TC Kimlik Numarası Giriniz!");
            return 0;
          }
        }
      } else {
        this.envService.presentAlert("Uyarı", "TC Kimlik Numarası 11 Haneden Oluşmaktadır.");

        return 0;
      }
    }

    this.envService.presentLoading();

    //Toptan musteri ise 
    if (this.serverService.Settings.V3Settings.SalesType == 0 || this.serverService.Settings.V3Settings.SalesType == 3) {
      this.customerModel.ModelType = 2;
      this.customerModel.CurrAccDescription = this.customerModel.FirstName + ' ' + this.customerModel.LastName;
      this.customerModel.OfficeCode = this.serverService.Settings.V3Settings.OfficeCode;
      this.customerModel.WholeSalePriceGroupCode = this.serverService.Settings.V3Settings.PriceGroupCode;
      this.customerModel.TaxOfficeCode = this.customerModel.TaxOfficeCode;
      this.customerModel.TaxNumber = this.customerModel.TaxNumber;
    }
    if (this.personelInfo) {
      this.personelInfo.BirthDate = this.serverService.convertIonic4Date(this.personelInfo.BirthDate);
      this.customerModel.CurrAccPersonalInfo = this.personelInfo;
      console.log('personalinfo', this.customerModel.CurrAccPersonalInfo)
    }


    //console.log(this.customerModel);
    this.serverService.addCustomer(this.customerModel)
      .then(res => {
        this.envService.dismissLoading();
        //console.log(res);

        let result: Customer = Object.assign(new Customer(), res);
        if (this.base64Image !== undefined) {
          if (this.imageNameReturn != false) {
            this.saveImage(result.CurrAccCode);
          }
        }
        //console.log(JSON.stringify(this.customerModel).toString());
        //this.addG3Log(JSON.stringify(this.customerModel),JSON.stringify(res));

        if (result.ModelType == 3 || result.ModelType == 2) {
          this.translateService.get(['ALERT_INFORMATION_TITLE_TEXT', 'CUSTOMER_ALERT_CUSTOMER_INFORMATIONS_SAVED_SUCCESSFULLY_MESSAGE_TEXT']).subscribe((value: string[]) => {
            this.envService.presentAlert(value['ALERT_INFORMATION_TITLE_TEXT'], value['CUSTOMER_ALERT_CUSTOMER_INFORMATIONS_SAVED_SUCCESSFULLY_MESSAGE_TEXT']);
          });
          this.editMode = false;

          // add attributes start
          if (this.AttributeCode13 != null)
            this.addCustomerAttribute13(result.CurrAccCode);
          if (this.AttributeCode14 != null)
            this.addCustomerAttribute14(result.CurrAccCode);
          if (this.AttributeCode17 != null)
            this.addCustomerAttribute17(result.CurrAccCode);
          // add attributes end

          if (this.newMode) {
            // this.streetNameReadMode = false;
            //  [G4_SetCustomerPostalAddresses]
            this.updateAddressData.Parameters[0].Value = result.CurrAccCode;
            this.serverService.getAny(this.updateAddressData);


            this.newMode = false;
            this.modalCtrl.dismiss({ customer: result });
          }
          this.navCtrl.back();
        } else {
          let result: Exception = Object.assign(new Exception(), res);
          this.translateService.get('ALERT_ERROR_TITLE_TEXT').subscribe((value: string) => {
            this.envService.presentAlert(value['ALERT_ERROR_TITLE_TEXT'], this.serverService.getReadableMessage(result.ExceptionMessage));
          });
        }
      })
      .catch(this.envService.handleError);
  }

  saveImage(CurrAccCode) {
    if (CurrAccCode == "") {
      CurrAccCode = this.customerModel.currAccCode;
    }
    this.serverService.addCustomerImage(CurrAccCode, this.base64Image.replace('data:image/jpeg;base64,', ''), this.imageName);
    this.imageURL = '';
    this.imageURL = this.serverService.Settings.G3Settings.ImageUrl + '/Home/GetThumbCustomer?curracccode=' + CurrAccCode;
  }

  async addPostalAddresses() {
    let modal;
    modal = await this.modalCtrl.create({
      component: ModalAddAddressPage
    });

    modal.onDidDismiss().then((data) => {
      console.log('onDidDismiss data', data.data);
      if (data.data.result == false) return;// if press 'BACK-ARROW'

      this.index = 0; //this.customerModel.PostalAddresses.length;
      this.customerModel.PostalAddresses.splice(0, 0, {});   //splice(position,numberofitemtoREMOVE,item) //other; .push({});
      this.world_check = data.txtDCoCode;
      this.customerModel.PostalAddresses[0].CountryCode = data.data.txtDCoCode.Code;
      this.customerModel.PostalAddresses[0].AddressTypeCode = data.data.txtDaddtype;
      this.customerModel.PostalAddresses[0].Address = data.data.txtDAddress;
      this.customerModel.PostalAddresses[0].StateCode = data.data.txtDSCode;
      this.customerModel.PostalAddresses[0].CityCode = data.data.txtDCiCode;
      this.customerModel.PostalAddresses[0].DistrictCode = data.data.txtDDCode;
      this.customerModel.PostalAddresses[0].BuildingNum = data.data.txtDBNum;
      this.customerModel.PostalAddresses[0].FloorNum = data.data.txtDFNum;
      this.customerModel.PostalAddresses[0].DoorNum = data.data.txtDDNum;

      this.customerModel.PostalAddresses[0].StreetName = data.data.txtDStreetCode;
      this.customerModel.PostalAddresses[0].QuarterName = data.data.txtDNeighborHoodCode;

      console.log("customerModel.PostalAddresses", this.customerModel.PostalAddresses[0]);

      this.onStateChange();


      console.log("editMode, newMode", this.editMode, this.newMode);
      console.log("addressDescriptions", this.addressDescriptions);
      //this.onCityChange();


      console.log("countryList", this.countryList);
      console.log("stateList", this.stateList);
      console.log("cityList", this.cityList);


      this.getStates(data.data.txtDCoCode);
      this.getCities(data.data.txtDSCode);
      this.getDistricts(data.data.txtDCiCode);

    });
    console.log("Customer Model", this.customerModel);
    return await modal.present();
  }

  async onCountryClick() {
    let modal = await this.modalCtrl.create({
      component: ModalCountryPage,
      componentProps: {
        'countries': this.countryList,
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data) {
        this.customerModel.PostalAddresses[this.index].CountryCode = data;//data.Code
        this.getStates(data);//data.Code
      }
    });
    return await modal.present();
  }

  onCountryChange() {
    const code = this.customerModel.PostalAddresses[this.index].CountryCode;
    console.log("country change click", code);
    this.getStates(code);
  }

  onStateChange() {

    const code = this.customerModel.PostalAddresses[this.index].StateCode;
    this.getCities(code);

  }

  onCityChange() {
    const code = this.customerModel.PostalAddresses[this.index].CityCode;
    this.getDistricts(code);
  }



  gotoInstallments() {

    let navigationExtras: NavigationExtras = {
      state: {
        installments: this.installments,
        installments_summary: this.installments_summary
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/customer-installments`, navigationExtras);
  }

  gotoExtras() {
    let navigationExtras: NavigationExtras = {
      state: {
        currAccCode: this.customer.CurrAccCode
      }
    };
    this.navCtrl.navigateForward(`${this.pageRoute}/customer-extra-report`, navigationExtras);
  }

  async addGuarantor() {
    let modal;
    modal = await this.modalCtrl.create({
      component: ModalGuarantorPage
    });

    modal.onDidDismiss().then((data) => {
      console.log(data.data);
      let addData = {
        "ProcName": "G4_AddGuarantor", "Parameters":
          [
            { "Name": "CurrAccCode", "Value": "" },
            { "Name": "FirstName", "Value": "" },
            { "Name": "LastName", "Value": "" },
            { "Name": "IdentityNum", "Value": "" },
            { "Name": "AddressTypeCode", "Value": "" },
            { "Name": "Address", "Value": "" },
            { "Name": "CountryCode", "Value": "" },
            { "Name": "StateCode", "Value": "" },
            { "Name": "CityCode", "Value": "" },
            { "Name": "DistrictCode", "Value": "" },
            { "Name": "BuildingNum", "Value": "" },
            { "Name": "FloorNum", "Value": "" },
            { "Name": "DoorNum", "Value": "" },
            { "Name": "CommunicationTypeCode", "Value": "" },
            { "Name": "CommAddress", "Value": "" },
            { "Name": "BirthPlace", "Value": "" },
            { "Name": "MotherName", "Value": "" },
            { "Name": "FatherName", "Value": "" },
            { "Name": "MaidenName", "Value": "" },
            { "Name": "MonthlyIncome", "Value": "" },
            { "Name": "DrivingLicenceType", "Value": "" },
            { "Name": "DrivingLicenceTypeNum", "Value": "" },
            { "Name": "IdentityCardNum", "Value": "" },
            { "Name": "RegisteredCityCode", "Value": "" },
            { "Name": "RegisteredDistrictCode", "Value": "" },
            { "Name": "RegisteredTown", "Value": "" },
            { "Name": "RegisteredNum", "Value": "" },
            { "Name": "RegisteredRecordNum", "Value": "" },
            { "Name": "RegisteredFamilyNum", "Value": "" },
            { "Name": "RegisteredFileNum", "Value": "" },
            { "Name": "SocialInsuranceNumber", "Value": "" },
            { "Name": "BirthDate", "Value": "" },
            { "Name": "GenderCode", "Value": "" }

          ]

      };
      data.data.personelInfo_BirthDate = this.serverService.convertIonic4Date(data.data.personelInfo_BirthDate);

      addData.Parameters[0].Value = this.customerModel.CurrAccCode;
      addData.Parameters[1].Value = data.data.txtGname;
      addData.Parameters[2].Value = data.data.txtGLname;
      addData.Parameters[3].Value = data.data.txtGInumber;

      addData.Parameters[4].Value = data.data.txtDaddtype //AddressTypeCode
      addData.Parameters[5].Value = data.data.txtDAddress//Address
      addData.Parameters[6].Value = data.data.txtDCoCode//CountryCode
      addData.Parameters[7].Value = data.data.txtDSCode//StateCode
      addData.Parameters[8].Value = data.data.txtDCiCode         //CityCode
      addData.Parameters[9].Value = data.data.txtDDCode    //DistrictCode
      addData.Parameters[10].Value = data.data.txtDBNum         //BuildingNum
      addData.Parameters[11].Value = data.data.txtDFNum        //FloorNum
      addData.Parameters[12].Value = data.data.txtDDNum          //DoorNum

      addData.Parameters[13].Value = '1'    //CommunicationTypeCode
      addData.Parameters[14].Value = data.data.txtGtel //CommAddress


      addData.Parameters[15].Value = data.data.personelInfo_BirthPlace
      addData.Parameters[16].Value = data.data.personelInfo_MotherName;
      addData.Parameters[17].Value = data.data.personelInfo_FatherName;
      addData.Parameters[18].Value = data.data.personelInfo_MaidenName;
      addData.Parameters[19].Value = data.data.personelInfo_MonthlyIncome
      addData.Parameters[20].Value = data.data.personelInfo_DrivingLicenceType
      addData.Parameters[21].Value = data.data.personelInfo_DrivingLicenceTypeNum
      addData.Parameters[22].Value = data.data.personelInfo_IdentityCardNum
      addData.Parameters[23].Value = data.data.personelInfo_RegisteredCityCode
      addData.Parameters[24].Value = data.data.personelInfo_RegisteredDistrictCode
      addData.Parameters[25].Value = data.data.personelInfo_RegisteredTown
      addData.Parameters[26].Value = data.data.personelInfo_RegisteredNum
      addData.Parameters[27].Value = data.data.personelInfo_RegisteredRecordNum
      addData.Parameters[28].Value = data.data.personelInfo_RegisteredFamilyNum
      addData.Parameters[29].Value = data.data.personelInfo_RegisteredFileNum
      addData.Parameters[30].Value = data.data.personelInfo_SocialInsuranceNumber
      addData.Parameters[31].Value = data.data.personelInfo_BirthDate
      addData.Parameters[32].Value = data.data.personelInfo_GenderCode
      console.log(data.data.personelInfo_BirthDate, data.data.personelInfo_GenderCode)
      if (data.data.personelInfo_BirthPlace == null) addData.Parameters[15].Value = ""
      if (data.data.personelInfo_MotherName == null) addData.Parameters[16].Value = ""
      if (data.data.personelInfo_FatherName == null) addData.Parameters[17].Value = ""
      if (data.data.personelInfo_MaidenName == null) addData.Parameters[18].Value = ""
      if (data.data.personelInfo_MonthlyIncome == null) addData.Parameters[19].Value = ""
      if (data.data.personelInfo_DrivingLicenceType == null) addData.Parameters[20].Value = ""
      if (data.data.personelInfo_DrivingLicenceTypeNum == null) addData.Parameters[21].Value = ""
      if (data.data.personelInfo_IdentityCardNum == null) addData.Parameters[22].Value = ""
      if (data.data.personelInfo_RegisteredCityCode == null) addData.Parameters[23].Value = ""
      if (data.data.personelInfo_RegisteredDistrictCode == null) addData.Parameters[24].Value = ""
      if (data.data.personelInfo_RegisteredTown == null) addData.Parameters[25].Value = ""
      if (data.data.personelInfo_RegisteredNum == null) addData.Parameters[26].Value = ""
      if (data.data.personelInfo_RegisteredRecordNum == null) addData.Parameters[27].Value = ""
      if (data.data.personelInfo_RegisteredFamilyNum == null) addData.Parameters[28].Value = ""
      if (data.data.personelInfo_RegisteredFileNum == null) addData.Parameters[29].Value = ""
      if (data.data.personelInfo_SocialInsuranceNumber == null) addData.Parameters[30].Value = ""
      if (data.data.personelInfo_BirthDate == null) addData.Parameters[31].Value = ""
      if (data.data.personelInfo_GenderCode == null) addData.Parameters[32].Value = ""

      console.log(addData)
      this.serverService.getAny(addData)
        .then(res => {
          console.log(res);
          this.getGuarantors();
        })
        .catch(this.envService.handleError);

    });
    return await modal.present();
  }

}
