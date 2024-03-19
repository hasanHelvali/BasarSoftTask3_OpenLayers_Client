import { Inject, Injectable } from '@angular/core';
import { CustomHttpClient } from './customHttpClient.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { GeneralDataService } from './general-data.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient:HttpClient,@Inject("baseUrl") private baseUrl:string,private spinner:NgxSpinnerService,
  private router:Router,private generalDataService:GeneralDataService) {}

  isActive:boolean;
  sonuc:boolean;
  //JWT'yi Doğrulama
  // verifyToken():Observable<any>{
  //   var token = this.getToken();
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //    return this.httpClient.get<boolean>(this.baseUrl+"/AuthManagement/VerifyToken",{headers:headers});
  // }

  // JWT'yi localStorage'a kaydetme
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // localStorage'dan JWT'yi alma
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // localStorage'dan JWT'yi silme
  removeToken(): void {
    localStorage.removeItem('token');
  }
}
