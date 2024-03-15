import { Injectable } from '@angular/core';
import { GeoLocation } from '../models/geo-location';
import { LocAndUsers } from '../models/locAndUsers';
import { Subject } from 'rxjs';
import { Observable } from 'ol';
import WKT from 'ol/format/WKT';
import { Geometry } from 'ol/geom';

@Injectable({
  providedIn: 'root'
})
export class LocDataService {
  data:GeoLocation

  data2:LocAndUsers

  listLocAndUser:LocAndUsers[]=[];

  getGeometryByWkt:string;
  constructor() {
   }

   getGeometryBywkt(_wkt){
    // this._options="";
    // this.isFeatureMapActive=true
    const wkt = _wkt
    console.log(wkt);
    const format=new WKT();
    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
  });
  }

}
