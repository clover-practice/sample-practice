import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../models/employee.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.employeeId = +id;
      this.employeeService.getEmployee(this.employeeId).subscribe((employee: any) => {
        this.employeeForm.patchValue(employee.result);
        // console.log(data.result);
      });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      if (this.employeeId) {
        var employee = this.employeeForm.value;
        // console.log(employee);
        employee.id = this.employeeId;
        this.employeeService.updateEmployee(employee).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.createEmployee(this.employeeForm.value).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      }
    }
  }
}
