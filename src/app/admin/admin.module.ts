import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RouterModule } from '@angular/router';
import { authGuard } from '../guards/custom.guard';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule} from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DialogService } from 'primeng/dynamicdialog';
@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    AdminPanelComponent,
    
  ],
  imports: [
    TableModule,
    CommonModule,
    RouterModule.forChild([
      {path:"roles",component:RolesComponent,canActivate:[authGuard],},
      {path:"users",component:UsersComponent,canActivate:[authGuard]},
      {path:"**",component:AdminPanelComponent,canActivate:[authGuard]}
    ]),
    DropdownModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    MessagesModule,
  ]
})
export class AdminModule { }
