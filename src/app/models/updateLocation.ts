export class UpdateLocation implements IUpdateGeoLocation {
    id: number;
    name: string;
    type: string;
    coordinates:any;
    wkt:string;
}

export interface IUpdateGeoLocation {
    id:number;
    name:string;
    type: string; //  geometry ( "Point", "LineString", "Polygon")
    coordinates: number[]; 
    wkt:string;
    
  }