import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role } from '../../models/users/role';
import { LoginComponent } from '../../components/login/login.component';
import { LoginCredentials } from '../../models/users/login-credentials';
import { response } from 'express';
import { error } from 'console';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'http://localhost:3001';
  private apiUrl = 'http://localhost:8080/inventario-app/auth/login';
  

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  /* login(email: string, password: string): Observable<boolean> {
    return this.http
      .get<{ id: number; email: string; password: string; name: string, role: Role }[]>(
        `${this.apiUrl}/users?email=${email}&password=${password}`
      )
      .pipe(
        map((users) => {
          const user = users.find(
            (u) => u.email === email && u.password === password
          );
  
          if (user) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('auth_token', 'your_token');
              sessionStorage.setItem('email', user.email);
              sessionStorage.setItem('userId', String(user.id));
              sessionStorage.setItem('name', user.name);
              sessionStorage.setItem('role', String(user.role)); 
              
            }
            
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(
            () => new Error('Error en login: ' + error.message)
          );
        })
      );
  } */
  login(loginCredentials: LoginCredentials){
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":"application/json"
      })
    };

    return this.http.post<any>(this.apiUrl, loginCredentials, httpOptions);

  }
  
  getUserName(): string | null {
    if (typeof window !== 'undefined') {
      //return sessionStorage.getItem('name');
      return this.cookieService.get('name');
    }
    return null;
  }

  getUserId(): string | null {
    if (typeof window !== 'undefined') {
      //return sessionStorage.getItem('id');
      return this.cookieService.get('id');
    }
    return null;
  }

  logout(): void {
    
      
        //sessionStorage.clear();
        /* this.cookieService.delete('email');
        this.cookieService.delete('userId');
        this.cookieService.delete('name');
        this.cookieService.delete('lastname');
        this.cookieService.delete('role');
        this.cookieService.delete('token'); */
        this.cookieService.deleteAll();
        window.location.reload();
      
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!this.cookieService.get('token');
    }
    return false;
  }

  isAdmin(): boolean {
    if (typeof window !== 'undefined') {
      return this.cookieService.get('role') === "ADMIN";
    }
    return false;
  }

}
