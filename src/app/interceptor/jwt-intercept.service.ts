import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CustomHttpClient } from '../services/customHttpClient.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
/*Bu bir interceptor yapısıdır. Bu yapı her httpClient isteginde tetiklenecek olan yapıdır. */
export class JwtInterceptService implements HttpInterceptor {//Interceptor servisler HttpInterceptor dan turerler.
  constructor(private authService:AuthService, private router:Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('token');//localStorage dan token alınır.
    if (jwtToken) {//token varlık kontrolu
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`//Eger token varsa her httpClient isteginin header ina bu token Bearer olarak eklenir. 
        }
      });
    }
    return next.handle(request).pipe(//kuyruk akısı backend e gittikten sonra devam ettirilir.
      catchError((error:HttpErrorResponse)=>{//eger bir hata varsa yakalanır
        if(error.status===401){//hata durum kodu kontrol edilir
          this.router.navigate(['login-signup'])//gaurd tetiklenir. Yonlendirme yapılır.
        }
        localStorage.removeItem("token")//token gecersiz oldugundan dolayı locakStorage dan token silinir.
        return throwError(()=>error);//error fırlatıldı. Bu ise yeni gelen throwError operatorudur. Bu hata httpClient isteklerinin error kısmında yakalanır.
      })
    );
  }
}
