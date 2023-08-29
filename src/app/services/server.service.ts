import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Color, PaymentPlan, Product, ProductPrice, Settings } from "../models/models";
import { Customer } from 'src/app/models/customer';
import * as $ from "jquery";

@Injectable({
    providedIn: 'root'
})
export class ServerService {

    isLoggedIn = false;
    loginResponse: any;

    VERSION: string = '1.5.0';
    CONNECT: string = '/IntegratorService/Connect';
    DISCONNECT: string = '/IntegratorService/Disconnect/';
    RUNPROC: string = '/IntegratorService/Runproc/';
    POST: string = '/IntegratorService/Post/';
    QMARK: string = '?';
    APPROVE: string = '/ShipmentService/ApproveTransfer'

    Settings: Settings;
    Items: Product[] = [];
    Colors: Color[] = [];

    //private base_url: string = "http://panel.giltas.com.tr/";
    private base_url: string = "http://giltasg4.giltas.com.tr/panel/";


    //private base_url:string = "http://localhost:8888/giltas_web/";
    public login_url: string = this.base_url + "ws/check_login.php";
    public logout_url: string = this.base_url + "ws/logout.php";

    public isOpenCamera: boolean = false;
    public openOrdersCount: number = 0;
    public notAcceptedShipmentCount: number = 0;

    constructor(
        private http: HttpClient,
        private storage: Storage
    ) { }

    login(account: any) {
        const options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };
        return this.http.post(this.login_url, account, options)
            .toPromise()
            .then(response => {
                console.log('Responsee', response);
                return response;
            })
    }
    connect(integrator, userData) {
        this.Settings.Integrator.Url = integrator;
        return new Promise((resolve, reject) => {
            let headers = new HttpHeaders();
            let url: string = this.Settings.Integrator.Url + this.CONNECT + this.QMARK + JSON.stringify(userData);
            console.log(url);
            return this.http.get(url, { headers: headers })
                .subscribe((res: any) => {
                    this.Settings.Token = res.Token;
                    resolve(res);
                },
                    (err) => {
                        reject(err);
                    });
        });
    }

    disconnect(): Promise<any> {
        let url: any = this.Settings.Integrator.Url + this.DISCONNECT + this.Settings.Token + this.QMARK;
        return this.http.get(url)
            .toPromise()
            .then((response: any) => {
                return response;
            })
            .catch(this.handleError);
    }
    getProducts(userData): Promise<Array<Product>> {
        console.log(userData);
        let url: any = this.Settings.Integrator.Url + this.RUNPROC + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then((response: Array<Product>) => {
                return response;
            })
            .catch(this.handleError);
    }

    getProductPrices(userData): Promise<Array<any>> {
        let url: any = this.Settings.Integrator.Url + this.RUNPROC + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        console.log('getProductPrice', url);
        return this.http.get(url)
            .toPromise()
            .then((response: Array<any>) => {
                return response;
            })
            .catch(this.handleError);
    }

    getAny(userData): Promise<any> {
        let url: any = this.Settings.Integrator.Url + this.RUNPROC + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then((response: any) => {
                return response;
            })
            .catch(this.handleError);
    }

    getProductPrice(userData): Promise<Product> {
        let url: any = this.Settings.Integrator.Url + this.RUNPROC + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        return this.http.get(url)
            .toPromise()
            .then((response: any) => {
                console.log("url : ",url)
                console.log("pricelistresponse : ",response);
                if (response == null || response.length == 0)
                    return null;
                let product = response[0];
                product.PriceList = [];
                for (let p of response) {
                    let pp = new ProductPrice();
                    pp.PaymentPlanCode = p.PaymentPlanCode;
                    pp.PriceGroupCode = p.PriceGroupCode;
                    pp.PriceGroupCodeWs = p.PriceGroupCodeWs;
                    pp.Price = p.Price;

                    product.PriceList.push(pp);
                }
                return product as Product;
            })
            .catch(this.handleError);
    }

    getPaymentPlan(userData): Promise<PaymentPlan[]> {
        let url: any = this.Settings.Integrator.Url + this.RUNPROC + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        return this.http.get(url)
            .toPromise()
            .then((response: PaymentPlan[]) => {
                return response;
            })
            .catch(this.handleError);
    }
    getCustomers(userData): Promise<Array<Customer>> {
        let url: any = this.Settings.Integrator.Url + this.RUNPROC + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then((response: Array<Customer>) => {
                return response;
            })
            .catch(this.handleError);
    }
    makeOrder(userData): Promise<any> {
        console.log("User Dataa", userData);
        let url: any = this.Settings.Integrator.Url + this.POST + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then((response: any) => {
                console.log(response);
                return response;
            })
            .catch(this.handleError);
    }

    addCustomer(userData): Promise<any> {
        let url: any = this.Settings.Integrator.Url + this.POST + this.Settings.Token + this.QMARK + JSON.stringify(userData);
        console.log(url)
        return this.http.get(url)

            .toPromise()
            .then((response: any) => {

                return response;
            })
            .catch(this.handleError);
    }

    addCustomerImage(currAccCode, base64string: string, imageName) {
        let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };
        var body = "curracccode=" + currAccCode + '&base64string=' + base64string + '&imageName=' + imageName;
        let url: any = this.Settings.G3Settings.ImageUrl + '/Home/SetCustomerImage?';
        this.http.post(url, body, headers)
            .toPromise()
            .then(data => {
            }).catch(error => {
                console.log(error.status);
            });
    }


    addCustomerImage_(currAccCode, base64string): Promise<any> {
        let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };
        let body = {
            currAccCode: currAccCode,
            base64string: base64string
        }
        let url: any = this.Settings.G3Settings.ImageUrl + '/Home/SetCustomerImage';
        console.log(body);
        return this.http.post(url, JSON.stringify(body), headers)
            .toPromise()
            .then((response: any) => {
                return response;
            })
            .catch(this.handleError);
    }

    addCustomerImage_f(currAccCode, base64string): Promise<any> {
        console.log(currAccCode);
        console.log(base64string);
        let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

        let formData: FormData = new FormData();
        formData.append('currAccCode', currAccCode);
        formData.append('base64string', base64string);
        console.log(formData);
        let url: any = this.Settings.G3Settings.ImageUrl + '/Home/SetCustomerImage';

        return this.http.post(url, formData, headers)
            .toPromise()
            .then((response: any) => {
                console.log(response);
                return response;
            })
            .catch(this.handleError);
    }

    getReadableMessage(message: string) {
        if (message == "CreditLimitLowerThanZero&&CreditLimitLowerThanZero")
            return "Limitiniz yetersiz!"
        else if (message == "")
            return "Hata Oluştu, Lütfen daha sonra tekrar deneyiniz!";
        else
            return message;
    }

    getItemsLength() {
        if (this.Items.length > 0)
            return this.Items.length
        return null;
    }

    convertIonic4Date(date) {
        date = new Date(date)
        var year: string = date.getFullYear().toString();
        var month: string = (date.getMonth() + 1).toString();
        var dt: string = date.getDate().toString();
        if (parseInt(dt) < 10) {
            dt = '0' + dt.toString();
        }
        if (parseInt(month) < 10) {
            month = '0' + month.toString();
        }
        return date = (year + '-' + month + '-' + dt)
    }

    convertDate(date: any) {
        var re = /\/Date\((-?[0-9]*)\)\//;
        var m = date.match(re);
        if (m) return new Date(parseInt(m[1])).toLocaleDateString();
        else return null;
    }

    convertISODate(date: any) {
        var re = /\/Date\((-?[0-9]*)\)\//;
        var m = date.match(re);
        var ISOdate = new Date(parseInt(m[1]));
        var year: string = ISOdate.getFullYear().toString();
        var month: string = (ISOdate.getMonth() + 1).toString();
        var dt: string = ISOdate.getDate().toString();
        console.log(year, month, dt)
        if (parseInt(dt) < 10) {
            dt = '0' + dt.toString();
            console.log(dt)
        }
        if (parseInt(month) < 10) {
            month = '0' + month.toString();
            console.log(month)
        }
        console.log(year + '-' + month + '-' + dt);
        if (m) return (year + '-' + month + '-' + dt)// ISOdate.toLocaleDateString();
        else return null;

    }

    convertDateTime(date: any) {
        var re = /\/Date\(([0-9]*)\)\//;
        var m = date.match(re);
        if (m) return new Date(parseInt(m[1]));
        else return null;
    }

    isValidNumberWithDecimal(event: KeyboardEvent, field) {
        let input = $('#' + field);
        console.log(input);
        if (input.length > 0) {
            //return /\d|Backspace/.test(event.key);
            if ([8, 9, 13, 27, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                // backspace, enter, escape, arrows, tab
                return true;
            } else if (event.keyCode >= 48 && event.keyCode <= 57) {
                // numbers 0 to 9
                return (!(event.keyCode == 48 && input.val().length == 1 && input.val() == '0'));
            } else if (event.keyCode >= 96 && event.keyCode <= 105) {
                // numpad number
                return (!(event.keyCode == 96 && input.val().length == 1 && input.val() == '0'));
            }
            else if (event.keyCode == 188 && input.val().length > 0 && input.val().indexOf('.') < 0) {
                return true;
            }
            return false;
        }
        else return false;
    }

    isValidIntegerNumber(event: KeyboardEvent, field) {
        let input = $('#' + field).find('input');
        if (input.length > 0) {
            //return /\d|Backspace/.test(event.key);
            if ([8, 9, 13, 27, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                // backspace, enter, escape, arrows, tab
                return true;
            } else if (event.keyCode >= 48 && event.keyCode <= 57) {
                // numbers 0 to 9
                return (!(event.keyCode == 48 && input.val().length == 0));
            } else if (event.keyCode >= 96 && event.keyCode <= 105) {
                // numpad number
                return (!(event.keyCode == 96 && input.val().length == 0));
            }
            return false;
        }
        else return false;
    }

    getColorDescription(colorCode: string) {
        if (colorCode)
            return this.Colors.find(x => x.ColorCode == colorCode).ColorDescription;
        else
            return colorCode;
    }

    checkDatabase() {
        if (this.Settings.Integrator.DatabaseName != 'SANALV3') {
            return 1;
        } else {
            return 0;
        }
    }


    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    postData(postData): Promise<any> {
        let url: any = this.Settings.Integrator.Url + this.POST + this.Settings.Token + this.QMARK + JSON.stringify(postData);
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then((response: any) => {
                return response;
            })
            .catch(this.handleError);
    }

    approveTransfer(postData): Promise<any> {
        let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };
        let url: any = this.Settings.Integrator.Url + this.APPROVE + this.Settings.Token + this.QMARK;
        console.log(url);
        return this.http.post(url, JSON.stringify(postData))
            .toPromise()
            .then((response: any) => {
                return response;
            })
            .catch(this.handleError);
    }
    getNotificationCount() {
        const sum: number = this.openOrdersCount + this.notAcceptedShipmentCount;
        if (sum == 0) return null;
        return sum;
    }

}
