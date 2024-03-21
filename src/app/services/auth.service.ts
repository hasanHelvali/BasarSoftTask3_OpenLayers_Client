import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { CustomHttpClient } from './customHttpClient.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { GeneralDataService } from './general-data.service';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient:HttpClient,@Inject("baseUrl") private baseUrl:string,private spinner:NgxSpinnerService,
  private router:Router,private generalDataService:GeneralDataService) {}

  isActive:boolean;
  sonuc:boolean;
  _token;
  role;
  //JWT'yi Doğrulama
  verifyToken():Observable<any>{
    // var token = this.getToken();
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.httpClient.get<boolean>(this.baseUrl+"/AuthManagement/VerifyToken");//backend e istek yapıp token dogrulaması yapılıyor.
  }
  // JWT'yi localStorage'a kaydetme
  setToken(token: string): void {
    this._token="";
    localStorage.setItem('token', token);
    this._token=token;
  }//Token guncellenir.


  // localStorage'dan JWT'yi alma
  getToken(): string | null {
    return localStorage.getItem('token');
  }//Tokne cagrılır.

  // localStorage'dan JWT'yi silme
  removeToken(): void {
    localStorage.removeItem('token');
    // this.jwtDataService.roles;
  }//Token silinir.
}
