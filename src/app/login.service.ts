import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    
  private apiUrl = 'http://localhost:3001/api';

    constructor(private http: HttpClient) {}

    login(user: any):Observable<any> {
      console.log(user);
      // return user;
      return this.http.post<any>(`${this.apiUrl}/users/login`, user);
    }

}
