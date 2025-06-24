import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:3001/api';

    constructor(private http: HttpClient) {}

    // getEmployees(): Observable<Employee[]> {
    //     return this.http.get<Employee[]>(this.apiUrl);
    // }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}/employees/getAllEmployee`);
    }

    getEmployee(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/employees/getEmployeeById/${id}`);
    }

    createEmployee(employee: Employee): Observable<Employee> {
        // return this.http.post<Employee>(this.apiUrl, employee);
        return this.http.post<Employee>(`${this.apiUrl}/employees/createEmployee`, employee);
    }

    updateEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}/employees/updateEmployeeById`, employee);
    }

    // updateEmployee(id: number, employee: Employee): Observable<Employee> {
    //     return this.http.post<Employee>(`${this.apiUrl}/employees/updateEmployeeById`, employee);
    // }

    deleteEmployee(id: number): Observable<Employee> { 
        return this.http.get<Employee>(`${this.apiUrl}/employees/deleteEmployeeById/${id}`);
    }
}
