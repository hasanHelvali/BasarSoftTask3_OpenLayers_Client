import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { LocDataService } from 'src/app/services/loc-data.service';

import * as $ from 'jquery';
import { GeneralDataService } from 'src/app/services/general-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GeoLocation, IGeoLocation } from 'src/app/models/geo-location';
import { UpdateLocation } from 'src/app/models/updateLocation';

@Component({
  selector: 'app-geometry-list-modal',
  templateUrl: './geometry-list-modal.component.html',
  styleUrls: ['./geometry-list-modal.component.css']
})
export class GeometryListModalComponent extends BaseComponent implements OnInit{
  
// listLocAndUsers:LocAndUsers[]=[]
isModalActive:boolean=false;
  dataSource: MatTableDataSource<any>|any;
  constructor(private httpClient:CustomHttpClient,public generalDataService:GeneralDataService,spinner:NgxSpinnerService, private cdr:ChangeDetectorRef,
    // private dialogRef: MatDialogRef<GeometryListModalComponent>,
    // @Inject(MAT_DIALOG_DATA) private data: LocAndUsers[]
    ) {
    super(spinner)
  }
  @ViewChild('liste') listModal: ElementRef;
  // @Input() listLocAndUsers:LocAndUsers[]; // Parent component'ten gelen veriyi almak için
  isRequest:boolean=false;;
  listLocAndUsers:LocAndUsers[]=[]
  ngOnInit(): void {
    this.generalDataService.listData.subscribe({
      next:(data:LocAndUsers[])=>{
        this.listLocAndUsers=data;
      },
      error:(err)=>{
        alert("Veriler Getirilirken Bir Hata Oluştu.")
      }
    })
  }

  getData(){
    this.showSpinner();
    this.generalDataService.listData.subscribe({
      next:(data)=>{
        this.listLocAndUsers=data;
        this.dataSource=data;
       this.hideSpinner();
      },
      error:(err)=>{
        alert("Kayıtlar Getirilirken Bir Hata Oluştu.");
        this.hideSpinner();
      }
    });
  }
  openModal()
  {
    //  this.getData();
    // const modalDiv=document.getElementById("liste")
    // if(modalDiv!=null){
    //   modalDiv.style.display="block"
    // }
  }
  setBlock(){
    
  }

  closeModal() {
    const modalDiv=document.getElementById("liste")
    if(modalDiv!=null)
      modalDiv.style.display="none"
    }

    deleteLocAndUser(id){
      this.showSpinner();
      // const row =$() document.getElementById("dataRow"+id);
      const element = $("#dataRow"+id);
      console.log(element);
      this.httpClient.delete<any>({controller:"maps"},id).subscribe({
        next:()=>{   
          this.hideSpinner();
          alert("Kaydınız Silinmiştir.");
          element.fadeOut(500, () => {
            // Animasyon tamamlandıktan sonra satırı DOM'dan kaldır
            element.remove();
          });
        },
        error:()=>{
          this.hideSpinner();
          alert("Kayıt Silinirken Bir Hata Oluştu.");
        }
      })
    }

    getLocation(id,name?,type?,wkt?){
      this.closeModal();
      var geoLoc=new UpdateLocation();
      geoLoc.id=id;
      geoLoc.name=name;
      geoLoc.type=type;
      geoLoc.wkt=wkt
      this.generalDataService.mapFeature.next(geoLoc);
    }

   
}
