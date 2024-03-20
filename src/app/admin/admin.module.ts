import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RouterModule } from '@angular/router';
import { authGuard } from '../guards/custom.guard';

// import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    AdminPanelComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:"roles",component:RolesComponent,canActivate:[authGuard],},
      {path:"users",component:UsersComponent,canActivate:[authGuard]},
      {path:"**",component:AdminPanelComponent,canActivate:[authGuard]}
    ]),
    // TableModule
  ]
})
export class AdminModule { }
