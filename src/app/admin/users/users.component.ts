import { LocalizedString } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users:Users[]=[];

  constructor(private httpClient:CustomHttpClient) {}
  ngOnInit(): void {
    this.getAllUser()
  }



  getAllUser(){
    console.log("-------------------------");
    
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

}