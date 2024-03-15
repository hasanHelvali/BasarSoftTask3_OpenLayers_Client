export class GeoLocation implements IGeoLocation {
    type: string;
    coordinates:any;
}

export interface IGeoLocation {
    type: string; // Type of the geometry (e.g., "Point", "LineString", "Polygon")
    coordinates: number[]; // Array of arrays representing coordinates
  }