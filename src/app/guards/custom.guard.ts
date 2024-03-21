import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralDataService } from '../services/general-data.service';

//Burası bir guard yapısıdır. Her url degisim talebinde tetiklenecek olan yapıdır.
export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | boolean | UrlTree|any => {
  const router=inject(Router);
  const spinner=inject(NgxSpinnerService);
  const authService=inject(AuthService);
  const generalDatas=inject(GeneralDataService);
//ctor yeni route yapılarında kaldırılmıstır. Bu sebeple Inject operatoru kullanılır.
  var token=authService.getToken();//token elde edilir.
  if(token!=null) {//token varsa
    spinner.show();//spinner başlatılır.
     const sonuc =  authService.verifyToken().subscribe({//bir httpClient istegi yapılır. Url degisimlerinde de token kontrol edilmelidir.
      next:(data)=>{//istek basarılıysa 
        spinner.hide();//spinner gizlenir.
        return true;//url yonlendirmesine izin verilir.
      },
      error:(err)=>{//istek basarısız ise 
        spinner.hide()//spinner gizlenir.
        router.navigate(['/login-signup']);//istek yonlendirmesi login tarafına yapılır cunku token gecersizdir.
        return false//istenilen yonlendirmeye izin verilmez.
      }
    })
  }
  else{//token yoksa giris hakkı yok kabul edilir.
    router.navigate(['/login-signup']);//yonlendirme yapılır.
    return false;//istenilen bir yonlendirme varsa buna izin verilmez.
  } 
};
