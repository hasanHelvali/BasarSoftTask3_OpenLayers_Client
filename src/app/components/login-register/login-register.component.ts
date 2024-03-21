import { BaseCdkCell } from '@angular/cdk/table';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/common/base/base.component';
import { Login } from 'src/app/models/login';
import { SignUp } from 'src/app/models/signup';
import { AuthService } from 'src/app/services/auth.service';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { GeneralDataService } from 'src/app/services/general-data.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent extends BaseComponent{

  isLogin:boolean=false;
  constructor(private httpClient:CustomHttpClient, private chr:ChangeDetectorRef,ngxSpinner:NgxSpinnerService, private authService:AuthService,
    private route:Router,private generalDataService:GeneralDataService) {
    super(ngxSpinner)
  }

  checkTokenValidity(token: string): Observable<boolean> {
    return this.httpClient.post<any>({controller:"auth",action:"checktokenvalidity"},{token});
  }

  changeState(){
    this.isLogin=!this.isLogin
    this.authService.removeToken();
    this.chr.detectChanges()
  }

  // createAccountStart(name?:string,surname?:string,email:string,password:string){
    createAccountStart(signUpModel:Partial<SignUp>){
      this.showSpinner();
      this.httpClient.post<any>({controller:"AuthManagement",action:"CreateUser"},signUpModel).subscribe({
        next:(data)=>{
          this.authService.removeToken();
          // this.authService.removeToken();
          alert("Kayınız başarıyla yapılmıştır. Giriş paneline yönlendiriliyorsunuz.")
          this.route.navigate(['login-signup'])
          // console.log(data.accessToken);
          this.isLogin=true;
          this.hideSpinner();
          // this.authService.setToken(data.accessToken)
        },
        error:(err)=>{
          alert(err.error)
          this.authService.removeToken();
          this.isLogin=false;
          this.hideSpinner();
        }
      })
      this.chr.detectChanges();
  }

  loginAccountStart(loginModel:Partial<Login>){
    this.showSpinner();
    this.httpClient.post<any>({controller:"AuthManagement",action:"LoginUser"},loginModel).subscribe({
      next:(data)=>{//Token in basarıyla uretilip geldigi yer.
        this.authService.removeToken();
        this.authService.setToken(data.accessToken)//Token guncellendi.
        this.isLogin=true;
        this.route.navigate(["/maps"])
        this.hideSpinner();
        this.generalDataService.jwtResolve()
      },
      error:(err)=>{
        this.authService.removeToken();
        alert("Kullanıcı Adı Veya Şifre Yanlış...")
        this.isLogin=true;
        this.hideSpinner();
      }
    })
    this.chr.detectChanges()
  }
}

