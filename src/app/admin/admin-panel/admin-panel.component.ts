import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralDataService } from 'src/app/services/general-data.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  /**
   *
   */
  constructor(public authService:AuthService, public generalDataService:GeneralDataService) {
    
  }
}
