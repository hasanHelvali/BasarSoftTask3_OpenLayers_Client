import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Type,
  numberAttribute,
} from '@angular/core';
import Map from 'ol/Map';
import { Draw, Interaction, Modify, MouseWheelZoom, Snap } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, get, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { LocDataService } from 'src/app/services/loc-data.service';
import { Circle, Geometry, LineString, Point, Polygon } from 'ol/geom';
import { BaseComponent } from 'src/app/common/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralDataService } from 'src/app/services/general-data.service';
import { Collection, Observable, Overlay, View } from 'ol';
import { LocalizedString } from '@angular/compiler';
import { IGeoLocation } from 'src/app/models/geo-location';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { GeometryListModalComponent } from '../geometry-list-modal/geometry-list-modal.component';
import { MatDialog } from '@angular/material/dialog';
import WKT from 'ol/format/WKT';
import { UpdateModalComponent } from '../update-modal/update-modal.component';
import { UpdateLocation } from 'src/app/models/updateLocation';
import { PointWKT } from 'src/app/models/pointWkt';
import { Tooltip } from 'primeng/tooltip';
import { overlapsType } from 'ol/expr/expression';
import { toStringHDMS } from 'ol/coordinate';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent extends BaseComponent implements OnInit {
  map: Map;
  vectorLayer: any;
  options = "";
  isOptionActive:boolean=false;
  locAndUsersList:LocAndUsers[];
  snap:any;
  isFeatureChanged=false;
  intersection:LocAndUsers=new LocAndUsers();
  pixel:any;
  drawInteraction:Draw;

  container = document.getElementById('popup');
   overlay = new Overlay({
    element: this.container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });
  

  constructor(
    ngxSpinner: NgxSpinnerService,
    public generalDataService: GeneralDataService,
    public mymodal: MyModalComponent,
    public locDataService: LocDataService,
    private httpCLientService:CustomHttpClient,
    private geometryListModal:GeometryListModalComponent,
    public dialog: MatDialog,
    public updateModal:UpdateModalComponent,
    private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
      super(ngxSpinner);
    }
    
  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([34.9998, 39.42152]),
        zoom: 6.8,
      }),
    });
    this.addLayer(); //haritaya bir layer eklendi.
    // this.locDataService.veriOlusturulduSubject.subscribe((veri) => {
    //   console.log('veri geldi');
    // });
    this.generalDataService.veriOlusturulduSubject.subscribe({
      next:()=>{
      this.clearFeature();//fetaure ların silinecegi fonskiyon burada tanımlandı.
      this.clearInteraction();
      // this.generalDataService.isOptionActive=false;
      },
      error:()=>{
        alert("Veri Gelmedi.");
        this.clearFeature();//fetaure ların silinecegi fonskiyon burada tanımlandı.
        this.clearInteraction();
      }
    });
    this.generalDataService.closedModal.subscribe({
      next:()=>{
      this.clearInteraction();
      this.clearFeature();
      this.options="";
      this.changeDetectorRef.detectChanges();
      },
      error:()=>{
        alert("Veri Gelmedi.");
        this.clearInteraction();
        this.clearFeature();
      }
    });
    this.generalDataService.selectedOptions.subscribe({
      next:(data)=>{
        this.options=data
        },
        error:()=>{
        }
    });
    this.generalDataService.mapFeature.subscribe({
      next:(data)=>{
        const _data=data as UpdateLocation;
        console.log("data-"+data);
        this.wktToMapFeature(_data);
        // this.clearInteraction();
        // this.clearFeature();
        },
        error:()=>{
          alert("Veri Gelmedi.");
          this.clearInteraction();
          this.clearFeature();
        }
    });
    this.generalDataService.featureUpdate.subscribe({
      next:(data)=>{
        this.isFeatureChanged=data as boolean
        this.changeDetectorRef.detectChanges()
        },
    });
    this.generalDataService.primeNgModal.subscribe({
      next:(data)=>{
        // this.isFeatureChanged=data as boolean
        this.primeNgModalFeature(data)
        this.changeDetectorRef.detectChanges()
        },
    });
    this.generalDataService.primeNgModalClosed.subscribe({
      next:(data )=>{
        if(data as boolean == true){
          this.clearFeature();
        }
        this.changeDetectorRef.detectChanges()
        },
    });

    this.generalDataService.startIntersection.subscribe({
      next:(data )=>{
        if(data as boolean == true){
          this.startIntersection();
        }
        this.changeDetectorRef.detectChanges()
        },
    });
    this.generalDataService.closeIntersection.subscribe({
      next:(data )=>{
        this.closeToolTip();
        this.changeDetectorRef.detectChanges()
        },
    });
  }
  
  addLayer() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: {
        // 'fill-color': 'rgba(255, 255, 255, 0.2)',
        'fill-color': 'rgba(0, 0, 0, 0.3)',
        'stroke-color': '#000',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
      className: 'vecLay',
    });
    this.map.addLayer(this.vectorLayer);
  }
  addFeature(value: string) {
    if(value=="") {
      this.map.removeInteraction(this.drawInteraction)
      return;
    }

    this.vectorLayer.getSource().clear();
    this.generalDataService.selectedOptions.next(value)
    this.options=value;
    var a =new VectorLayer();
    
    let that = this;
    // this.generalDataService.getFeatureType(""); //service deki feature tipini guncellestiriyorum.
    this.generalDataService.getFeatureType(value); //service deki feature tipini guncellestiriyorum.
    that.drawInteraction = new Draw({
      type: this.generalDataService._featureType, // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
    });
    
    this.map.addInteraction(that.drawInteraction); //interaction i map e ekliyorum.
    // this.changeDetectorRef.detectChanges();
    
    // vectorLayer.getSource().clear()
    this.map.on('click', (event) => {
      //her click edildiginde
      const coordinateLong = event.coordinate[0];
      const coordinateLat = event.coordinate[1];
    });

    that.drawInteraction.on('drawend', function (event) {
      that.generalDataService.setLocation(null);
      that.generalDataService._wkt=null;
      //cizim bittiginde
      that.clearFeature() 
      var feature = event.feature;
      const _type: FeatureType = event.feature
        .getGeometry()
        .getType() as FeatureType;
        console.log(_type);
        
      if(feature){
        that.generalDataService.createdFeature.next("Feature Olusturuldu.");
        // that.map.removeInteraction(that.drawInteraction)
      }
      that.vectorLayer.getSource().addFeature(feature);
      var geometry = feature.getGeometry() as any;
      const data: IGeoLocation = {
        type: geometry.getType(),
        coordinates: geometry.getCoordinates(),
      };
      that.generalDataService.geometryToWkt(feature); //service class ında bir property ye wkt verisi aktarıldı.
      that.generalDataService.setLocation(data);
      // Burada ilgili service yapısına datalar gonderildigi anda ilgili coordinates modalı acılır.
    });
  }
  clearFeature() {
    this.vectorLayer.getSource().clear();//Burada source icinde ki feature lar temizlendi.
  }
  clearInteraction(){
    this.map.getInteractions().clear();
  }

  getGeometryListModal(){
    this.geometryListModal.openModal()
  }

  openDilaog(){
    this.showSpinner();
    this.httpCLientService.get<LocAndUsers>({controller:"maps"}).subscribe({
      next:(data:LocAndUsers[])=>{
        this.generalDataService.listData.next(data);
        
        this.generalDataService.getGeometryListModal()//Modal Acılıyor.
        this.hideSpinner()
        const dialogRef = this.dialog.open(GeometryListModalComponent,{
        });
        dialogRef.afterClosed().subscribe(result => {
          // console.log(`Dialog result: ${result}`);
        });
      },
      error:(err)=>{
        this.hideSpinner()
        //Yapılacak Baska İşlemler de var.
      }
    });
  }

  openChangeDialog(){
    // this.mymodal.updateModal();
    this.generalDataService.featureUpdate.next(true);
    this.updateModal.openModal()
  }

  wktToMapFeature(_data?:UpdateLocation){
    this.vectorLayer.getSource().clear();
    var format=new WKT();
    const feature = format.readFeature(_data.wkt,{
      dataProjection:'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    console.log(feature);
    const source =this.vectorLayer.getSource();
    source.addFeature(feature);
    this.map.getView().fit(feature.getGeometry() as any,{padding:[40,40,40,40],duration:1000})    

    const modify = new Modify({source: source});
    this.map.addInteraction(modify);
    this.snap = new Snap({source: source});
    this.map.addInteraction(this.snap);
    //Feature da degisiklik yapılmasına olanak saglayan yapılar bunlardır.

    modify.on('modifystart', () => {
      console.log("-------------");
      this.isFeatureChanged=true;
      this.changeDetectorRef.detectChanges()
      // feature.modified = true; // Özelliği güncelleme
    });
    modify.on('modifyend', () => {
      console.log("-------------");
      this.generalDataService.featureUpdate.next(true);
      // this.isFeatureChanged=true
      var geometry = feature.getGeometry() as any;
      const data: IGeoLocation = {
        type: geometry.getType(),
        coordinates: geometry.getCoordinates(),
      };

      this.generalDataService.updatedLocation=data;
      _data.type=data.type;
      _data.coordinates=data.coordinates;
      //Elde edilen son geometri verisini wkt ye tekrardan cast etmem gerek
      _data.wkt=this.generalDataService.updateGeometryToWkt(feature);
      this.generalDataService.featureUpdateGeneralData.next(_data);

      // Değişiklikler tamamlandı
    });
}
    primeNgModalFeature(wkt){
      console.log(wkt);
    this.vectorLayer.getSource().clear();
    var format=new WKT();
    const feature = format.readFeature(wkt,{
      dataProjection:'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    const source =this.vectorLayer.getSource();
    source.addFeature(feature);
    this.map.getView().fit(feature.getGeometry() as any,{padding:[40,40,40,40],duration:1000})    
    }


    startIntersection(){
      // this.closeToolTip()
      this.changeDetectorRef.detectChanges();
      this.vectorLayer.getSource().clear();
      let that=this;
      // this.clearFeature();
      // this.clearInteraction();
      // this.startIntersection();
      // this.map.addInteraction("Point");
      const drawInteraction = new Draw({
        type: "Point", // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
      });//point olusuturukldu
      this.map.addInteraction(drawInteraction);//Point seklindeki interaction haritaya eklendi.

      drawInteraction.on('drawend', function (event) {
        var feature = event.feature;
        var geometry = feature.getGeometry() as any;
        var coordinates= geometry.getCoordinates();
        
        const _type: FeatureType = event.feature
          .getGeometry()
          .getType() as FeatureType;
        var geometry = feature.getGeometry() as any;
        console.log(feature.getGeometry());
        var format = new WKT();
        const _locWkt = format.writeGeometry(feature.getGeometry(), {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        that.showSpinner();
        var pointWKT:PointWKT=new PointWKT();
        pointWKT.pointWKT=_locWkt

        that.showSpinner();
        that.httpCLientService.post<any>({controller:"maps",action:"InteractionExists"},pointWKT).subscribe({
          next:(data)=>{
            that.hideSpinner();
            if(data==null){
              // console.log("null");
              // alert("Kesişim Yok.")
              that.generalDataService.modelIntersection.next("Bir Kesişim Bulunamadı.");
              that.overlay.setPosition(coordinates);
              // that.closeToolTip();<
              //  this.overlay.setPosition(undefined);
              that.generalDataService.intersectionActive.next(false);

              that.vectorLayer.getSource().clear()
              // that.clearInteraction()
               that.changeDetectorRef.detectChanges()
              return 
            }
            that.intersection=data as LocAndUsers;
            
            that.overlay = new Overlay({
              element: document.getElementById('popup'),
              autoPan: true,
            });

            that.map.addOverlay(that.overlay);
            const hdms = toStringHDMS(toLonLat(coordinates));
            that.generalDataService.modelIntersection.next({hdms:hdms,name:data.name });
            that.overlay?.setPosition(coordinates);
            that.vectorLayer.getSource().addFeature(feature);
            that.changeDetectorRef.detectChanges();
          },
          error:(err)=>{
            alert("Analiz Yapılamadı.")
            that.hideSpinner();
            that.closeToolTip();
          }
        }) 
        


        that.map.on('click', (event) => {
           that.clearFeature()
           that.pixel = event.pixel
           that.changeDetectorRef.detectChanges()
        });
        })
  }
  closeToolTip(){
    this.vectorLayer.getSource().clear()
    console.log("-----------------");
    this.clearInteraction();
   this.overlay.setPosition(undefined);
  //  this.overlay.dispose();
   this.generalDataService.intersectionActive.next(false);
   this.changeDetectorRef.detectChanges();
  }
}
export enum FeatureType {
  Circle = 'Circle',
  LineString = 'LineString',
  Point = 'Point',
  Polygon = 'Polygon',
}
