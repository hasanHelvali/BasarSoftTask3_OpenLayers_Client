import { Component, OnInit } from '@angular/core';
import { MyModalComponent } from './components/my-modal/my-modal.component';
import { LocDataService } from './services/loc-data.service';
import { BaseComponent } from './common/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralDataService } from './services/general-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit {
  data:any;
  constructor(public locDataService:LocDataService,spinner:NgxSpinnerService, public generalDataService:GeneralDataService) {
    super(spinner)
  }
  ngOnInit(): void {
  }
  title = 'BasarSoftTask1_Client';

  
  
}
