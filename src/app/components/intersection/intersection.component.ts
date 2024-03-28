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
    this.generalDataService.modelIntersection.subscribe({
      next:(data)=>{
        this.customIntersec=data
        console.log(this.customIntersec);
        
        this.changeDetectorRef.detectChanges()
      }
    })
    this.generalDataService.intersectionActive.subscribe({
      next:(data)=>{
        this.isActive=data
        console.log(data);
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
    this.changeDetectorRef.detectChanges();
    this.generalDataService.intersectionActive.next(true);
    this.changeDetectorRef.detectChanges();
    // console.log(this.customIntersec?.name);
    // console.log(this.customIntersec?.hdms);
    var tooltipElement = document.getElementById('tooltip');
    var tooltipOverlay =tooltipElement as unknown as Overlay
     this.generalDataService.intersectionPosition.subscribe({
    next:(coordinate)=>{
        tooltipOverlay.setPosition(coordinate);
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  startIntersection2(){
    this.generalDataService.startIntersection.next(true);
    this.generalDataService.intersectionActive.next(true);
    this.changeDetectorRef.detectChanges();
  }
  close(){
    this.generalDataService.closeIntersection.next("");
    this.generalDataService.startIntersection.next(false);
    this.changeDetectorRef.detectChanges();
  }
}
