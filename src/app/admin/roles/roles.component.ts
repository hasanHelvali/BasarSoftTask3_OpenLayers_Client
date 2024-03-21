import { Component, OnInit } from '@angular/core';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  /**
   *
   */
  constructor(private httpClient:CustomHttpClient) {
  }
  cities: Roles[] | undefined;
  selectedCity: Roles | string="";

ngOnInit(): void {
  this.getAllUser()
  this.cities = [
    { name: 'Admin',id:1},
    { name: 'User' ,id:2},
  ];
}
getAllUser(){
  this.httpClient.get<any>({controller:"AuthManagement",action:"GetAllUsers"}).subscribe({
    next:(data)=>{
      console.log(data);
      this.users=data;
      console.log(this.users);
      
    },
    error:(err)=>{
      console.log(err);
      
    }
  })
}
users=[]
}
interface Roles {
  id:number;
  name: string;
}