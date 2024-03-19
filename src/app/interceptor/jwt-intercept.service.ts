import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpClient } from '../services/customHttpClient.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptService implements HttpInterceptor {

  constructor(private authService:AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
    }

    // this.authService.verifyToken();

    return next.handle(request);
  }

  // verifyToken():Observable<any>{
  //   var token = this.getToken();
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //    return this.httpClient.get<boolean>(this.baseUrl+"/AuthManagement/VerifyToken",{headers:headers});
  // }
    //JWT'yi Doğrulama
  // verifyToken():Observable<any>{
  //   var token = this.getToken();
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //    return this.httpClient.get<boolean>(this.baseUrl+"/AuthManagement/VerifyToken",{headers:headers});
  // }
}
