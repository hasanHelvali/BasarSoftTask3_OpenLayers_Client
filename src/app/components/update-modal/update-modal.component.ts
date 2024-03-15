import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { GeoLocation, IGeoLocation } from 'src/app/models/geo-location';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { LocationAndUsers } from 'src/app/models/location-and-users';
import { UpdateLocation } from 'src/app/models/updateLocation';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { GeneralDataService } from 'src/app/services/general-data.service';
import { LocDataService } from 'src/app/services/loc-data.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css']
})
export class UpdateModalComponent extends BaseComponent implements OnInit {
  data: UpdateLocation=new UpdateLocation();
  data2: LocAndUsers;
  wkt: string;
  locationAndUser: LocationAndUsers = new LocationAndUsers();
  locAndUsers: LocAndUsers = new LocAndUsers();
  // modelDiv=document.getElementById("myModal")
  isFeatureChanged=false;

  coordinatesAndType: IGeoLocation;
  constructor(
    private locDataService: LocDataService,
    private httpClient: CustomHttpClient,
    spinner: NgxSpinnerService,
    public generalDataService: GeneralDataService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super(spinner);

  }
  ngOnInit(): void {
    console.log("updateModal");

    this.generalDataService.featureUpdate.subscribe({
      next:(data)=>{
        // this.wktToMapFeature(data);
        // this.clearInteraction();
        // this.clearFeature();
        this.isFeatureChanged=data as boolean
        this.changeDetectorRef.detectChanges()
        },
        error:()=>{
          alert("Veri Gelmedi.");
          // this.clearInteraction();
          // this.clearFeature();
        }
    });

    this.generalDataService.featureUpdateGeneralData.subscribe({
      next:(data)=>{
        this.data=data as UpdateLocation;
        console.log(this.data);

      },
      error:(err)=>{

      }
    })
  }

  openModal() {
    const modelDiv = document.getElementById('myUpdateModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  closeModal() {
    const modelDiv = document?.getElementById('myUpdateModal');
    if (modelDiv != null) modelDiv.style.display = 'none';
    this.generalDataService.location = null;
    this.locDataService.data2 = null;
    this.generalDataService.isModalActive = false;
    this.generalDataService.closedModal.next('Modal Kapatıldı.');
    this.generalDataService.selectedOptions.next('');
  }

  save(name: string) {
    this.showSpinner();
    this.locationAndUser.coordinates = this.data.coordinates;
    this.locationAndUser.type = this.data.type;
    this.locationAndUser.name = name;
    this.locAndUsers.wkt = this.data.wkt;

    var locData:LocAndUsers=new LocAndUsers();
    locData.id=this.data.id;
    locData.name=name;
    locData.type=this.data.type;
    locData.wkt=this.data.wkt;
    console.log(locData);

    this.httpClient
      .put<LocAndUsers>({ controller: 'maps' }, locData)
      .subscribe({
        next: (data) => {
          this.hideSpinner();
          alert('Veri Kaydedilmiştir.');
          this.closeModal();
          // this.generalDataService.veriOlusturulduSubject.next(
          //   'Veri Kaydedildi.'
          // );
          // this.generalDataService.location
          // this.generalDataService.featureUpdateGeneralData=null;
          // this.generalDataService.options="default"
          // this.locationAndUser=null;
          // this.locDataService.data=null;
          this.data=null;
          locData=null;
          // this.generalDataService.featureUpdateGeneralData=null;
          this.generalDataService.featureUpdate.next(false)

        },
        error: (err) => {
          this.hideSpinner();
          alert(err);
          console.log(err.message);

          this.closeModal();
          // this.generalDataService.veriOlusturulduSubject.next(
          //   'Veri Kaydedilmedi.'
          // );
          this.generalDataService.featureUpdate.next(false)

          this.generalDataService.location = null;
          this.generalDataService.isModalActive = false;
          // this.generalDataService.options="default"
        },
      });
  }

}
