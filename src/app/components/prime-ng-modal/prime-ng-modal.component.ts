import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeNode } from 'primeng/api';
import { BaseComponent } from 'src/app/common/base/base.component';
import { NodeData, NodeTreeData } from 'src/app/models/nodeData';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { GeneralDataService } from 'src/app/services/general-data.service';
// import { NodeService } from '../../service/nodeservice';
@Component({
  selector: 'app-prime-ng-modal',
  templateUrl: './prime-ng-modal.component.html',
  styleUrls: ['./prime-ng-modal.component.css']
})
export class PrimeNgModalComponent extends BaseComponent implements OnInit {
  visible: boolean = false;
  position: string = 'center';
  dataList:NodeData[];
  // constructor(private nodeService: NodeService) {}
  files: TreeNode[]=[];
  seçiliÖge;
  constructor(private httpClient:CustomHttpClient, spinner:NgxSpinnerService,  private readonly changeDetectorRef: ChangeDetectorRef,
    public generalDataService:GeneralDataService) {
    super(spinner);
  }
  ngOnInit() {
  } 

  showDialog() {
    this.showSpinner();
    let that=this;
    this.httpClient.get<NodeData>({controller:"maps"}).subscribe({
     next:(data)=>{
      this.hideSpinner();
      // this.dataList=data as NodeData[]
      var _data =data as NodeData[]
      for (let index = 0; index < _data.length; index++) {
        that.files.push({key:_data[index].id.toString(),label:_data[index].name,type:_data[index].type,data:_data[index].wkt,children:[]})
      }
      console.log(that.files);
      this.visible = true;
      this.changeDetectorRef.detectChanges();
     },
     error:(err)=>{
      alert("Veri Gelmedi.")
      this.hideSpinner();
     } 
    })

  }

  selected(event){
    console.log(event.node);//secili node un kendisi alındı.
    console.log(event.node.data);//Burada da wkt verisini almıs olduk.
    const wkt=event.node.data;
    this.generalDataService.primeNgModal.next(wkt);//wkt akısı baslatıldı.
  }
  primeModalHide(){
    this.generalDataService.primeNgModalClosed.next(true);
  } 
}
