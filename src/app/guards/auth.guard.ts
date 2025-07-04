
// import { AuthService } from '../auth.service';

// export const authGuard = () => {
//     return AuthService;
//   };

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service'; // Example import

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {} // Inject dependencies

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      // Implement your guard logic here
      // return true; // Replace with your logic
      const userName = sessionStorage.getItem('UserName');
      // console.log(userName,"token");
      // this.authService.login(token);
      if (userName) {
        this.authService.loggedIn = true;
        // return true;
      } else { 
        this.authService.loggedIn = false;
        // return false;
      }
      return this.authService.loggedIn;
      
  }
}