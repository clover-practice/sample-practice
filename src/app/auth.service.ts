import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn:boolean = false;

  constructor(
    private router: Router
  ) {}

  login(){
    if(this.loggedIn){
      this.router.navigate(['/employees']);
    }else{
      this.router.navigate(['/login']);
    }
  }
}
