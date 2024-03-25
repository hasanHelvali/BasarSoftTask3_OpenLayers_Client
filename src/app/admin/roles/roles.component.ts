import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { Users } from 'src/app/models/users';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent extends BaseComponent implements OnInit {
  constructor(private httpClient:CustomHttpClient,private chr:ChangeDetectorRef, spinner:NgxSpinnerService) {
    super(spinner)
  }
  userOpt: User[] | undefined;
  users:Users[]=[]


  selectedRoles="";

ngOnInit(): void {
  this.getAllUser()
  this.userOpt = [
    { name: 'Admin',id:1},
    { name: 'User' ,id:2},
  ];
}
getAllUser(){
  this.httpClient.get<any>({controller:"AuthManagement",action:"GetAllUsers"}).subscribe({
    next:(data)=>{
      console.log(data);
      this.users=data;
      console.log(this.users);
      
    },
    error:(err)=>{
      console.log(err);
      
    }
  })
}
  changeRole(user:Users,selectedRoles:User){
    user.role.push(selectedRoles.name)
    this.chr.detectChanges();
    const button:HTMLButtonElement =document.getElementById("btn"+user.id) as HTMLButtonElement;
    console.log(user);
    
    if(user.role[0]==selectedRoles.name){
      button.disabled=true;
    }
    else{
      button.disabled=false;
    }
    this.chr.detectChanges();
  }
  changeRoleContinue(user:Users,selectedValue){///Burada kalındı.
    this.showSpinner();
    user.role[0]=selectedValue.name;
    console.log(user);
    this.httpClient.put<any>({controller:"roles",action:"UpdateRole"},user).subscribe({
      next:(data)=>{
        this.hideSpinner();
        alert("Rol güncelleme başarılı...")
        const button:HTMLButtonElement =document.getElementById("btn"+user.id) as HTMLButtonElement;
        button.disabled=true;
        console.log(this.users);
        console.log(data);
        this.selectedRoles=selectedValue
        this.chr.detectChanges()
        this.getAllUser();
      },
      error:(err)=>{
        alert("Rol güncelleme başarısız oldu...")
        console.log(err);
        this.hideSpinner();
      }
    })    
    this.chr.detectChanges();
  }
}
interface User {
  id:number;
  name: string;
  // isActive:boolean;
}