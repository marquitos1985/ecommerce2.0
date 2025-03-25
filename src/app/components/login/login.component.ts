import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login/auth.service';
import { LoginCredentials } from '../../models/users/login-credentials';
import { UserService } from '../../services/user/user.service';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
            sessionStorage.setItem('token', this.token);
            /* sessionStorage.setItem('email', response['email']);
            sessionStorage.setItem('userId', response['id']);
            sessionStorage.setItem('name', response['name']);
            sessionStorage.setItem('role', response['role']); */
            
            this.userService.getUserByEmail(loginCredentials.getEmail()).subscribe({
              next: response =>{
                sessionStorage.setItem('email', response['email']);
                sessionStorage.setItem('userId', response['id']);
                sessionStorage.setItem('name', response['name']);
                sessionStorage.setItem('role', response['role']);
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
