import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  /**
   *
   */
  constructor(private httpClient:CustomHttpClient) {
    
  }

  checkTokenValidity(token: string): Observable<boolean> {
    return this.httpClient.post<any>({controller:"auth",action:"checktokenvalidity"},{token});
  }
}
