import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
    // this.getUser();
    this.getTopology();
    this.generalDataService.jwtResolve()
  }
  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }
  

  ngOnInit() {
   
    this.showSpinner();
    this.httpClient.get<Users>({controller:"AuthManagement",action:"GetAllUsers"})
    .subscribe({
      next:(data )=>{
        this.users=data;
         console.log(data);
        console.log(this.users);
        this.hideSpinner();
        this.chr.detectChanges()
      },
      error:(err)=>{
        alert("Bir hata olustu.")
        // this.topologies=[];
        this.hideSpinner()
      }
    })
  this.chr.detectChanges()
  }

  getTopology(){
    this.httpClient.get<any>({controller:"maps"})
      .subscribe({
        next:(data )=>{
          this.topologies=data;
          console.log(data);
          this.chr.detectChanges();
        },
        error:(err)=>{
          alert("Bir hata olustu.")
          this.topologies=[];
        }
      })
  }
  show(topology:LocAndUsers) {
    this.selectedTopology=topology
    this.visible=true;
    this.chr.detectChanges();
  }



  assignTopology(user:Users){
    console.log(user);
    this.geoAuth.user=user;
    this.geoAuth.location=this.selectedTopology;

    this.httpClient.post<any>({controller:"GeographyAuthority",action:"AssignRoleAndUser"},this.geoAuth).subscribe({
      next:(data)=>{
        
      },
      error:(err)=>{

      }
    })    
  }

}
