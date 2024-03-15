import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injectable,
  OnInit,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { GeoLocation, IGeoLocation } from 'src/app/models/geo-location';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { LocationAndUsers } from 'src/app/models/location-and-users';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { GeneralDataService } from 'src/app/services/general-data.service';
import { LocDataService } from 'src/app/services/loc-data.service';

declare var $: any;
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.css'],
})
export class MyModalComponent extends BaseComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;

  data: GeoLocation;
  data2: LocAndUsers;
  wkt: string;
  locationAndUser: LocationAndUsers = new LocationAndUsers();
  locAndUsers: LocAndUsers = new LocAndUsers();
  // modelDiv=document.getElementById("myModal")

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
    // this.data=this.locDataService.data;
    this.data = this.generalDataService.location;
    this.wkt = this.generalDataService._wkt;
    var isModalActive = this.generalDataService.isModalActive;
    this.changeDetectorRef.detectChanges();
    if (this.generalDataService.createdFeature) {
      this.openModal();
    }
    this.changeDetectorRef.detectChanges();
    this.generalDataService.createdFeature.subscribe({
      next: () => {
        this.openModal();
      },
      error: () => {},
    });

    this.generalDataService.featureUpdate.subscribe({
      next: (data) => {
        this.updateModal();
      },
      error: (err) => {},
    });
    this.changeDetectorRef.detectChanges();
  }
  openModal() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }
  updateModal() {
    // this.closeModal()
    const modelDiv = document.getElementById('myModal');
    console.log(modelDiv);

    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
    console.log('------------------------------');

    this.changeDetectorRef.detectChanges();
  }
  closeModal() {
    const modelDiv = document?.getElementById('myModal');
    if (modelDiv != null) modelDiv.style.display = 'none';
    this.generalDataService.location = null;
    this.locDataService.data2 = null;
    this.generalDataService.isModalActive = false;
    this.generalDataService.closedModal.next('Modal Kapatıldı.');
    this.generalDataService.selectedOptions.next('');
    this.changeDetectorRef.detectChanges()
  }
  save(name: string) {
    this.showSpinner();
    this.locationAndUser.coordinates = this.data.coordinates;
    this.locationAndUser.type = this.generalDataService.location.type;
    this.locationAndUser.name = name;
    this.locAndUsers.type = this.generalDataService.location.type;
    this.locAndUsers.name = name;
    this.locAndUsers.wkt = this.generalDataService._wkt;
    this.httpClient
      .post<LocAndUsers>({ controller: 'maps' }, this.locAndUsers)
      .subscribe({
        next: (data) => {
          this.hideSpinner();
          alert('Veri Kaydedilmiştir.');
          this.closeModal();
          this.generalDataService.veriOlusturulduSubject.next(
            'Veri Kaydedildi.'
          );
          this.generalDataService.location = null;
          // this.generalDataService.options="default"
        },
        error: (err) => {
          this.hideSpinner();
          alert('Veri Eklenirken bir hata oluştu');
          this.closeModal();
          this.generalDataService.veriOlusturulduSubject.next(
            'Veri Kaydedilmedi.'
          );
          this.generalDataService.location = null;
          this.generalDataService.isModalActive = false;
          // this.generalDataService.options="default"
        },
      });
  }
}
