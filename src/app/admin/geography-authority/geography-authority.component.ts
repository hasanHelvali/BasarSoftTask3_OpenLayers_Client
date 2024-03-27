import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { loadFeaturesXhr } from 'ol/featureloader';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/common/base/base.component';
import { GeoAuth } from 'src/app/models/geoAuth';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { Users } from 'src/app/models/users';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { GeneralDataService } from 'src/app/services/general-data.service';

@Component({
  selector: 'app-geography-authority',
  templateUrl: './geography-authority.component.html',
  styleUrls: ['./geography-authority.component.css'],
  providers: [DialogService, MessageService]
})
export class GeographyAuthorityComponent extends BaseComponent implements OnInit, OnDestroy  {
  geoAuths: GeoAuth[]=[];
  topologies:LocAndUsers[]=[];
  users:Users[]=[];
  selectedCity: undefined;
  visible:boolean=false;
  ref: DynamicDialogRef | undefined;
  selectedTopology:LocAndUsers;
   geoAuth=new GeoAuth();
  constructor(private httpClient:CustomHttpClient,private generalDataService:GeneralDataService,spinner:NgxSpinnerService,
    public chr:ChangeDetectorRef,private dialogService:DialogService, public messageService: MessageService)  {
    super(spinner)
    // this.getTopology();
    // this.generalDataService.jwtResolve()
  }
  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }


  ngOnInit() {
    this.getTopology();
    this.generalDataService.jwtResolve()
    this.showSpinner();
    this.getAllUser();
    this.chr.detectChanges()
  }
  // getTopology(){

  // }

getAllUser(){
  this.httpClient.get<Users>({controller:"AuthManagement",action:"GetAllUsers"})
  .subscribe({
    next:(data )=>{
      this.users=data;
      //  console.log(data);
      // console.log(this.users);
      // this.getActiveUser();
      this.hideSpinner();
      this.chr.detectChanges()

    },
    error:(err)=>{
      alert("Bir hata olustu.")
      this.hideSpinner()
    }
  })
this.chr.detectChanges()
}
  getTopology(){
    this.showSpinner();
    this.httpClient.get<any>({controller:"maps"})
      .subscribe({
        next:(data )=>{
          this.topologies=data;
          console.log(data);
          // this.chr.detectChanges();
          this.hideSpinner()
        },
        error:(err)=>{
          alert("Bir hata olustu.")
          this.topologies=[];
          this.hideSpinner()

        }
      })
  }
  show(topology:LocAndUsers) {
    this.selectedTopology=topology
    this.visible=true;
    this.chr.detectChanges();
  }



  assignTopology(user:Users){
    this.showSpinner();
    this.geoAuth.users=user;
    this.geoAuth.topology=this.selectedTopology;
    var selectedTopology=this.selectedTopology
    this.httpClient.post<any>({controller:"GeographyAuthority",action:"AssignRoleAndUser"},this.geoAuth).subscribe({
      next:(data)=>{
        this.hideSpinner();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Kayıt Başarılı' });
        this.getAllUser();
        this.getTopology();
        this.visible=false
        this.chr.detectChanges()
      },
      error:(err)=>{
        this.hideSpinner();
        this.getAllUser();
        this.getTopology();
        this.visible=false
        this.messageService.add({ severity: 'error', summary: 'Başarısız', detail: 'Kayıt Başarısız.' });
        this.chr.detectChanges()
      }
    })
  }


  clearTopologyAndCloseModal(user:Users){
    this.showSpinner();
    this.httpClient.delete<any>({controller:"GeographyAuthority"},user.id).subscribe({
      next:(data)=>{
        this.hideSpinner();
        this.getAllUser();
        this.getTopology();
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kayıt Silme İşlemi Başarılı.' });
        this.visible=false
      },
      error:(err)=>{
        this.hideSpinner();
        this.getAllUser();
        this.getTopology();
        this.messageService.add({ severity: 'error', summary: 'Başarısız', detail: 'Bir Sorun Oldu.' });
        this.visible=false
      }
    })
  }

}
export class LocWithUserId{
  locationID:number;
  usersID:string;
}