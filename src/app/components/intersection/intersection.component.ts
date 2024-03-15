import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay } from 'ol';
import { BaseComponent } from 'src/app/common/base/base.component';
import { CustomIntersection } from 'src/app/models/intersection';
import { GeneralDataService } from 'src/app/services/general-data.service';

@Component({
  selector: 'app-intersection',
  templateUrl: './intersection.component.html',
  styleUrls: ['./intersection.component.css']
})
export class IntersectionComponent extends BaseComponent implements OnInit {
  container = document.getElementById('popup');
  content = document.getElementById('popup-content');
  closer = document.getElementById('popup-closer');
  overlay:Overlay;
  customIntersec:any
  isNoPopup:string;
  constructor(spinner:NgxSpinnerService, private generalDataService:GeneralDataService, private  changeDetectorRef: ChangeDetectorRef) {
    super(spinner);
  }
  ngOnInit(): void {
    // this.overlay=  new Overlay({
    //   element: this.container,
    //   autoPan: {
    //     animation: {
    //       duration: 250,
    //     },
    //   },
    // });


    this.generalDataService.modelIntersection.subscribe({
      next:(data)=>{
        this.customIntersec=data
        this.changeDetectorRef.detectChanges()
      }
    })
    this.generalDataService.intersectionActive.subscribe({
      next:(data)=>{
        this.isActive=data
        this.changeDetectorRef.detectChanges()
      }
    })
    this.generalDataService.noPopup.subscribe({
      next:(data)=>{
        this.isNoPopup=data;
        this.changeDetectorRef.detectChanges()
        this.customIntersec=null;
      }
    })
  }
  isActive:boolean=false;

  startIntersection(){
    this.generalDataService.startIntersection.next(true);
    // this.isActive=true;
    this.generalDataService.intersectionActive.next(true);
    this.changeDetectorRef.detectChanges();
  }

  close(){
    this.generalDataService.closeIntersection.next("");
    // this.isActive=false;
    this.generalDataService.startIntersection.next(false);
    this.changeDetectorRef.detectChanges();
  }
}
