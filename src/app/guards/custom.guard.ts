import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

export const authGuard: CanActivateFn = (route, state) => {
  // const jwtHelper=inject(JwtHelperService);
  const router=inject(Router);
  const spinner=inject(NgxSpinnerService);
  const authService=inject(AuthService);

  spinner.show();
  if(!authService.verifyToken())
  {
    router.navigate(["login"],{queryParams:{returnUrl:state.url}})
    // toastr.message("Oturum Acmanız Gerekiyor","Yetkisiz Erisim!",
    // {messageType:ToastrMessageType.Warning,
      // position:ToastrPosition.TopRight
    // })
  }
  spinner.hide();//spinner
  return false;
};
