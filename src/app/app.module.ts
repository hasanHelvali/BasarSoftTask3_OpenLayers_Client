import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { FormsModule } from '@angular/forms';
import { MyModalComponent } from './components/my-modal/my-modal.component';
import { BaseComponent } from './common/base/base.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GeometryListModalComponent } from './components/geometry-list-modal/geometry-list-modal.component';
import { MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';
import { PrimeNgModalComponent } from './components/prime-ng-modal/prime-ng-modal.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { IntersectionComponent } from './components/intersection/intersection.component';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MyModalComponent,
    GeometryListModalComponent,
    UpdateModalComponent,
    PrimeNgModalComponent,
    IntersectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    DialogModule,
    ButtonModule,
    TreeModule,
    TreeTableModule
  ],
  providers: [{provide:"baseUrl",useValue:"https://localhost:7295/api"},MyModalComponent,GeometryListModalComponent,UpdateModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }