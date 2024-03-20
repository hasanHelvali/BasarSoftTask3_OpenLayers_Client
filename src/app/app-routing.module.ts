import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { authGuard } from './guards/custom.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

const routes: Routes = [
  {path:"",component:MapComponent,canActivate:[authGuard]},
  {path:"login-signup",component:LoginRegisterComponent},
  {path:"maps",component:MapComponent,canActivate:[authGuard]},
  // {path:"admin",component:AdminPanelComponent,canActivate:[authGuard]},
  {path:"admin",component:AdminPanelComponent,
  loadChildren:()=>import("./admin/admin.module").then(module=>module.AdminModule),canActivate:[authGuard]},
  {path:"**",component:MapComponent,canActivate:[authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
