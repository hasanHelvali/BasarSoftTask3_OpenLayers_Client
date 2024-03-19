import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralDataService } from '../services/general-data.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | boolean | UrlTree|any => {
  // const jwtHelper=inject(JwtHelperService);
  const router=inject(Router);
  const spinner=inject(NgxSpinnerService);
  const authService=inject(AuthService);
  const generalDatas=inject(GeneralDataService);

  var token=authService.getToken();
  console.log();
  
  if(token!=null) {
    var isActive:boolean;
    spinner.show();
     const sonuc =  authService.verifyToken().subscribe({
      next:(data)=>{
        isActive=true;
        spinner.hide();
        return true;
      },
      error:(err)=>{
        isActive=false;
        spinner.hide()
        router.navigate(['/login-signup']);
        return false
      }
    })
  }
  else{
    router.navigate(['/login-signup']);
    return false;
  } 
};
