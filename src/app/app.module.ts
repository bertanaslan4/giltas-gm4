import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateConfigService } from './services/translate-config.service';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";//Hangi sayfada kullanıcaksan onun modülüne eklemen gerekli.
import { BrMaskerModule } from 'br-mask';//Hangi sayfada kullanıcaksan onun modülüne eklemen gerekli.
import { IonicSelectableModule } from 'ionic-selectable';//Hangi sayfada kullanıcaksan onun modülüne eklemen gerekli.
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalAddAddressPageModule } from 'src/app/pages/modal-add-address/modal-add-address.module'
import { ModalAttributeTypePageModule } from 'src/app/pages/modal-attribute-type/modal-attribute-type.module'
import { ModalGuarantorPageModule } from 'src/app/pages/modal-guarantor/modal-guarantor.module'
import { ModalCountryPageModule } from 'src/app/pages/modal-country/modal-country.module'
import { ModalReportProposalFilterPageModule} from 'src/app/pages/modal-report-proposal-filter/modal-report-proposal-filter.module'
import { ProposalPageModule } from 'src/app/pages/proposal/proposal.module';
import { ProposalTypePageModule } from 'src/app/pages/proposal-type/proposal-type.module';
import { ProductDetailPageModule } from 'src/app/pages/product-detail/product-detail.module'
import { Camera } from '@ionic-native/camera/ngx';
import { ModalProposalReceiptPageModule } from './pages/modal-proposal-receipt/modal-proposal-receipt.module';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ModalFilterReportPageModule } from 'src/app/pages/modal-filter-report/modal-filter-report.module'
import { from } from 'rxjs';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import { OpenOrdersPageModule } from './pages/open-orders/open-orders.module';
import { ShipmentsPageModule } from './pages/shipments/shipments.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/languages/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LazyLoadImageModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    BrMaskerModule,
    ModalAddAddressPageModule,
    ModalAttributeTypePageModule,
    ModalGuarantorPageModule,
    ModalCountryPageModule,
    IonicSelectableModule,
    ModalReportProposalFilterPageModule,
    ModalProposalReceiptPageModule,
    ProposalPageModule,
    ProposalTypePageModule,
    ProductDetailPageModule,
    ModalFilterReportPageModule,
    OpenOrdersPageModule,
    ShipmentsPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    

    
  ],
  providers: [
    
    StatusBar,
    SplashScreen,
    TranslateConfigService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    File,
    FileOpener,
    EmailComposer,    
    BarcodeScanner,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
