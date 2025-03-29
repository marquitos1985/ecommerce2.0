import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/login/auth.service';
import { LoginCredentials } from '../../models/users/login-credentials';
import { UserService } from '../../services/user/user.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  private token: string = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /* login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = '*Email o constraseña incorrecto';
          }
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
  } */
    login(): void {
      
      if (this.loginForm.valid) {
        let loginCredentials: LoginCredentials = new LoginCredentials(this.loginForm.get("email")?.value, this.loginForm.get("password")?.value);
        this.authService.login(loginCredentials).subscribe({
          next: (response) =>{
            this.token = response['token'];
            this.cookieService.set('token', this.token);
            //sessionStorage.setItem('token', this.token);
            /* sessionStorage.setItem('email', response['email']);
            sessionStorage.setItem('userId', response['id']);
            sessionStorage.setItem('name', response['name']);
            sessionStorage.setItem('role', response['role']); */
            
            this.userService.getUserByEmail(loginCredentials.getEmail()).subscribe({
              next: response =>{
                console.log(response);
                /* sessionStorage.setItem('email', response['email']);
                sessionStorage.setItem('userId', response['id']);
                sessionStorage.setItem('name', response['name']);
                sessionStorage.setItem('role', response['role']); */
                this.cookieService.set('email', response['email']);
                this.cookieService.set('id', response['id']);
                this.cookieService.set('name', response['name']);
                this.cookieService.set('lastname', response['lastname']);
                this.cookieService.set('role', response['role']);
              }, error: error =>{
                console.log("No se pudieron obtener los datos del usuario...");
              }
            });
            
            this.router.navigate(['/']);
          },
          error: (error) =>{
            this.errorMessage = '*Email o constraseña incorrecto';
          }
        });

      }
    }
}
