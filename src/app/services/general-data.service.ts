import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FeatureType } from '../components/map/map.component';
import WKT from 'ol/format/WKT';
import { GeoLocation, IGeoLocation } from '../models/geo-location';
import { Subject, of } from 'rxjs';
import { Observable } from 'rxjs';
import { LocAndUsers } from '../models/locAndUsers';
import { CustomHttpClient } from './customHttpClient.service';
import { UpdateLocation } from '../models/updateLocation';
import { CustomIntersection } from '../models/intersection';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  /**
   *
   */
  constructor(private httpCLientService:CustomHttpClient) {
  }
  public veriOlusturulduSubject = new Subject<any>()
  public closedModal = new Subject<any>()
  public createdFeature = new Subject<any>()
  public selectedOptions = new Subject<any>()
  public listData = new Subject<LocAndUsers[]>()
  public mapFeature = new Subject<UpdateLocation>()
  public featureUpdate = new Subject<boolean>()
  // public featureUpdateCoordinates = new Subject<any>()
  public featureUpdateGeneralData = new Subject<UpdateLocation>()
  
  public primeNgModal = new Subject<any>()
  public primeNgModalClosed = new Subject<boolean>()
  
  public startIntersection = new Subject<boolean>()
  public closeIntersection= new Subject<any>()
  public modelIntersection= new Subject<any>()
  public intersectionActive= new Subject<boolean>()
  public noPopup= new Subject<any>()
  
  public isAuth= new Subject<any>()

  public intersectionPosition= new Subject<any>()

  // public token= new Subject<any>()
  // public roles= new Subject<any>()

  // public hdms= new Subject<string>()

  // public modalAc = new Subject<any>()
  _featureType: FeatureType;
  isModalActive:boolean=false;;
  location:IGeoLocation;
  public _wkt:string
  locAndUsersList:LocAndUsers[];

  isFeatureUpdate:boolean;
  updatedLocation:IGeoLocation;
   updatedWkt:string
   token:string

  options = [
    // { value: 'default', text: '--Seçiniz--' },
    { value: 'Point', text: 'Point' },
    { value: 'LineString', text: 'LineString' },
    { value: 'Polygon', text: 'Polygon' },
    { value: 'Circle', text: 'Circle' },
  ];
  
  getFeatureType(value: string) {
    for (const _type in FeatureType) {
      if (_type == value) {
        this._featureType = _type as FeatureType;
      }
    }
  }

  geometryToWkt(feature){
    var format = new WKT();
    const _wkt = format.writeGeometry(feature.getGeometry(), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    this._wkt=_wkt;
    return _wkt;
  }
  updateGeometryToWkt(feature):string{
    var format = new WKT();
    const _wkt = format.writeGeometry(feature.getGeometry(), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    return _wkt;
  }
  setLocation(data:IGeoLocation){
    this.location=data;
    this.isModalActive=true;
  }
  getGeometryListModal(){
    this.httpCLientService.get<LocAndUsers>({controller:"maps"}).subscribe({
      next:(data:LocAndUsers[])=>{
        this.listData.next(data);
      },
      error:(err)=>{
        // alert()
      }
    });
  }
  resolvedToken:string;
  role:string;
  userName:string;
  identifier:string;
  jwtResolve(){
    this.token= localStorage.getItem('token');
    this.resolvedToken=jwtDecode(this.token);
    this.role= this.resolvedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; 
    this.userName=this.resolvedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    this.identifier=this.resolvedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    // console.log(this.resolvedToken);
    // console.log(this.role);
    // console.log(this.userName);
  }



}
