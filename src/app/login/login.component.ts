import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatCardModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  
  ngOnInit(): void {
    // this.authService.login()
    if(sessionStorage.getItem('UserName')){
      this.router.navigate(['/employees']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {

      var user = {
        email: this.loginForm.value.email,
        password: btoa(this.loginForm.value.password)
      };

      // console.log(user);

      var userDetails = {
        user: btoa(JSON.stringify(user))
      };

      // console.log(userDetails);
      
      this.loginService.login(userDetails).subscribe((data: any) => {
        // console.log(data);
        if(data.result){
          // console.log("do this");
          sessionStorage.setItem('UserName',user.email);
          this.authService.loggedIn = true;
          this.authService.login();
        }

      });
      
    }
  }

  

}
