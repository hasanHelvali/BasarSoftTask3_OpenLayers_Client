import { LocalizedString } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { extend } from 'ol/extent';
import { Message } from 'primeng/api';
import { BaseComponent } from 'src/app/common/base/base.component';
import { Users } from 'src/app/models/users';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { DialogService } from 'primeng/dynamicdialog'
import { GeneralDataService } from 'src/app/services/general-data.service';
declare var $:any
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent implements OnInit {
  users:Users[]=[];
  visible: boolean = false;
  messages: Message[] | undefined;
  dialogUser:Users

  showMessage:boolean=false;
  constructor(private httpClient:CustomHttpClient,ngxSpinner:NgxSpinnerService,public generalDataService:GeneralDataService) {
    super(ngxSpinner)
  }
  ngOnInit(): void {
    this.getAllUser()
    // this.messages = [{ severity: 'success', summary: 'Success', detail: 'İşleminiz Başarılı!!!' }];
    this.messages = [{ severity: 'success', summary: 'Success', detail: 'İşleminiz Başarılı!!!',closable:false,life:1000 }];

  }



  getAllUser(){
    console.log("-------------------------");
    
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


  deleteUser(id:string){
    this.showSpinner();
    const elementToHide = document.getElementById(id)!=null?document.getElementById(id):HTMLElement;
    console.log(elementToHide);
    this.httpClient.delete({controller:"Admin"},id).subscribe({
      next:(data)=>{
        this.hideSpinner()
        alert("Kayıt Başarıyla Silindi.")
        $("#" + id).fadeOut(500);

      },
      error:(err)=>{
        this.hideSpinner()
        alert("Bir hata oluştu")
      }
    })
  }

  value: string;
  updateUser(name,email){
    this.dialogUser.name=name
    this.dialogUser.email=email
    //degerler guncellendi
    this.showSpinner();
    this.httpClient.put<any>({controller:"admin",action:"UpdateUser"},this.dialogUser).subscribe({
      next:(data)=>{
        this.hideSpinner()
        this.showMessage=true;
        this.visible=false;
        //#region 
        setTimeout(() => {
          this.messages=[];
        }, 1000);
        this.messages = [{ severity: 'success', summary: 'Success', detail: 'İşleminiz Başarılı!!!',closable:false,life:1000 }];
        //Bu kodlar message in acılıp kapanmasını saglayan yapı. Mantıgını ben de kuramadım.
        //#endregion
      },
      error:(err)=>{
        this.hideSpinner()
        alert("İslem Basarısız Oldu.0")
        this.visible=false;
      }
    })
  }

  showDialog(user:Users){
    this.visible = true;
    this.dialogUser=user
  }
}